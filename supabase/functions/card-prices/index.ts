// @ts-nocheck
/// <reference path="../deno.d.ts" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface PriceData {
  price: number | string;
  closing_date?: string;
}

interface CardPricesResponse {
  error?: string;
  prices?: PriceData[];
}

const API_KEY = Deno.env.get("CARDHEDGER_API_KEY")!;
const API_URL = "https://api.cardhedger.com/v1/cards/prices-by-card";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const API_TIMEOUT_MS = 20000;
const CONCURRENCY = 3;

const CARDS = [
  { id: "1687993974477x685136523964710900", name: "Giratina V Alt Art (Lost Origin)" },
  { id: "1732594329916x689519845559121400", name: "Pikachu EX (Surging Sparks)" },
  { id: "1732663423946x994774247643739500", name: "Greninja EX (Twilight Masquerade)" },
  { id: "1732750645690x550048467565349440", name: "Mew EX (Paldean Fates)" },
  { id: "1664422049907x737490529634600800", name: "Umbreon VMAX Alt Art (Evolving Skies)" },
  { id: "1677725926476x276616302051726720", name: "Charizard V (Brilliant Stars)" },
  { id: "1676763578139x695243872946098200", name: "Lugia V Alt Art (Silver Tempest)" },
  { id: "1691965645753x960983635457739300", name: "Magikarp (Paldea Evolved)" },
  { id: "1664422049103x214086753109337570", name: "Rayquaza VMAX (Evolving Skies)" },
  { id: "1759900720581x745374157458988700", name: "Charizard EX (151)" },
  { id: "1736438249303x483546564885555000", name: "Umbreon EX (Prismatic Evolutions)" },
  { id: "1664334903325x615195437495392500", name: "Gengar VMAX (Fusion Strike)" },
  { id: "1664422100438x407063930823894300", name: "Dragonite V (Evolving Skies)" },
  { id: "1745590540746x385649263567175700", name: "Mewtwo (Black Star Promos)" },
  { id: "1745765714667x858799091619987500", name: "Pikachu (Black Star Promos)" },
  { id: "1646615786118x244697357144328930", name: "Charizard (Base Set)" },
  { id: "1722950486990x964153591510335500", name: "Ancient Mew (Game Movie Promo)" },
  { id: "1658801856548x308045861895233100", name: "Charizard Crystal (Skyridge)" },
  { id: "1647324618521x686174044902457300", name: "Dark Charizard (Team Rocket)" },
  { id: "1655157202430x173128736763629820", name: "Shining Charizard (Neo Destiny)" },
  { id: "1677027971173x732566788568979300", name: "Alakazam (Fates Collide)" },
  { id: "1734214940971x366352826269443500", name: "M Charizard EX (X) Secret (XY Flashfire)" },
  { id: "1690595716318x486306095839592200", name: "M Charizard EX Full Art (XY Evolutions)" },
  { id: "1733526596208x549269026812140300", name: "Charizard GX (Burning Shadows)" },
  { id: "1732812834628x591344956640004400", name: "Charizard GX (Hidden Fates Shiny Vault)" },
  { id: "1733439069922x165872669123306560", name: "Mewtwo GX (Shining Legends)" },
  { id: "1732936704151x306860576612707500", name: "Latias & Latios GX (Team Up)" },
  { id: "1690595778499x764267752847841400", name: "Charizard (XY Evolutions)" },
  { id: "1733793572965x243517925067338940", name: "M Rayquaza EX (XY Ancient Origins)" },
  { id: "1732936444785x801101407330903000", name: "Gengar & Mimikyu GX (Team Up)" },
];

// Concurrency limiter that processes items in parallel up to the limit
async function runWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];
  let active = 0;
  let index = 0;

  return new Promise((resolve) => {
    async function runNext() {
      // If we've processed all items, wait for active ones to finish
      if (index >= items.length) {
        if (active === 0) {
          resolve(results);
        }
        return;
      }

      // Start new tasks up to the limit
      while (active < limit && index < items.length) {
        const currentIndex = index++;
        active++;

        await new Promise(res => setTimeout(res, 300));

        Promise.resolve(fn(items[currentIndex]))
          .then(
            (value) => {
              results[currentIndex] = { status: "fulfilled" as const, value };
            },
            (reason) => {
              results[currentIndex] = { status: "rejected" as const, reason };
            }
          )
          .finally(() => {
            active--;
            runNext();
          });
      }
    }

    runNext();
  });
}

// Check if entry exists using optimized query
async function entryExists(
  supabase: any,
  cardId: string,
  grade: string,
  date: string
): Promise<boolean> {
  try {
    const { count } = await supabase
      .from("card_prices_graded")
      .select("id", { count: "exact", head: true })
      .eq("card_id", cardId)
      .eq("grade", grade)
      .eq("date", date);

    return (count ?? 0) > 0;
  } catch (error) {
    console.error(`Error checking entry existence for ${cardId}:`, error);
    return false;
  }
}

// Handle a single card with timeout and error handling
async function handleCard(
  card: { id: string; name: string },
  supabase: any,
  today: string,
  grade: string
): Promise<{ card_id: string; card_name: string; grade: string; price_usd: number; date: string } | null> {
  try {
    // Check if today's entry exists
    const exists = await entryExists(supabase, card.id, grade, today);
    if (exists) {
      return null; // Skip if already exists
    }

    // API call with timeout - always attempt for all card IDs
    let price_usd: number | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card_id: card.id, grade: "psa10" }),
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeout);
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API returned HTTP error: ${res.status}`, errorText);
        throw new Error(`API HTTP error: ${res.status}`);
      }

      const data: CardPricesResponse = await res.json();

      if (data.error) {
        throw new Error(`API returned error: ${data.error}`);
      }

      if (data.prices && data.prices.length > 0) {
        const latest = data.prices[0];
        price_usd = typeof latest.price === "string" ? parseFloat(latest.price) : latest.price;
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error(`Timeout fetching price for ${card.name}`);
        // Don't return early - let fallback logic handle it
        price_usd = null;
      } else {
        // For other errors, also fall through to fallback logic
        console.error(`Error fetching price for ${card.name}:`, error.message || error);
        price_usd = null;
      }
    }

    // Fallback to last known price if API failed
    if (price_usd === null) {
      price_usd = await getLastKnownPrice(supabase, card.id, grade);
      if (price_usd === null) {
        return null; // No data available
      }
      console.log(`Fallback price for ${card.name}: $${price_usd}`);
    } else {
      console.log(`API price for ${card.name}: $${price_usd}`);
    }

    // Prepare row for batch insert
    return {
      card_id: card.id,
      card_name: card.name,
      grade,
      price_usd,
      date: today,
    };
  } catch (error) {
    console.error(`Error processing ${card.name}:`, error);
    return null;
  }
}

// Get last known price as fallback
async function getLastKnownPrice(
  supabase: any,
  cardId: string,
  grade: string
): Promise<number | null> {
  try {
    const { data: last } = await supabase
      .from("card_prices_graded")
      .select("price_usd")
      .eq("card_id", cardId)
      .eq("grade", grade)
      .order("date", { ascending: false })
      .limit(1);

    if (!last || last.length === 0) {
      return null;
    }

    const price = last[0].price_usd;
    return typeof price === "string" ? parseFloat(price) : price;
  } catch (error) {
    console.error(`Error fetching last known price for ${cardId}:`, error);
    return null;
  }
}


serve(async (req: Request) => {
  const start = performance.now();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const today = new Date().toISOString().split("T")[0];
  const grade = "PSA 10"; // Database grade format (keep as is for DB queries)

  try {
    // Process all cards in parallel with concurrency limit
    const settled = await runWithLimit(CARDS, CONCURRENCY, (card) =>
      handleCard(card, supabase, today, grade)
    );

    // Collect successful results for batch insert
    const rowsToInsert = settled
      .filter((r) => r.status === "fulfilled" && r.value !== null && !(r.value as any).error)
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    // Count errors
    const errors = settled.filter(
      (r) => r.status === "rejected" || (r.status === "fulfilled" && ((r.value as any)?.error || r.value === null))
    ).length;

    // Single batch insert
    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("card_prices_graded")
        .insert(rowsToInsert);

      if (insertError) {
        console.error(`Batch insert error: ${insertError.message}`);
        return Response.json(
          { error: `Database insert failed: ${insertError.message}` },
          { status: 500 }
        );
      }
    }

    const elapsedMs = Math.round(performance.now() - start);
    console.log(`Processed ${CARDS.length} cards, inserted ${rowsToInsert.length} in ${elapsedMs}ms`);

    return Response.json({
      processed: CARDS.length,
      inserted: rowsToInsert.length,
      errors,
      time_ms: elapsedMs,
    });
  } catch (error) {
    console.error("Fatal error in card-prices function:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
});
