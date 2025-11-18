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

const GRADES = ["PSA 10"];

serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let updated = 0;
  let noData = 0;
  let errors = 0;
  const results = [];
  const today = new Date().toISOString().split("T")[0];

  for (const card of CARDS) {
    const grade = "PSA 10";

    try {
      console.log(`🔍 Checking ${card.name}...`);

      // Check if today's entry exists
      const { data: todayEntry } = await supabase
        .from("card_prices_graded")
        .select("id")
        .eq("card_id", card.id)
        .eq("grade", grade)
        .eq("date", today)
        .limit(1);

      if (todayEntry && todayEntry.length > 0) {
        console.log(`ℹ️ Already have today's price.`);
        continue;
      }

      // API call
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card_id: card.id, grade }),
      });

      if (!res.ok) {
        console.error(`❌ API HTTP error: ${res.status}`);
        errors++;
        continue;
      }

      const data: CardPricesResponse = await res.json();

      if (data.error) {
        console.warn(`🚫 API returned error: ${data.error}`);
        errors++;
        continue;
      }

      let price_usd: number | null = null;

      if (data.prices && data.prices.length > 0) {
        const latest = data.prices[0];
        price_usd = typeof latest.price === "string" ? parseFloat(latest.price) : latest.price;
      } else {
        // Fallback to last known price
        const { data: last } = await supabase
          .from("card_prices_graded")
          .select("price_usd")
          .eq("card_id", card.id)
          .eq("grade", grade)
          .order("date", { ascending: false })
          .limit(1);

        if (!last || last.length === 0) {
          console.log(`❌ No API or historical price available.`);
          noData++;
          continue;
        }

        price_usd = typeof last[0].price_usd === "string"
          ? parseFloat(last[0].price_usd)
          : last[0].price_usd;
      }

      // Insert today's price
      const { error: insertError } = await supabase
        .from("card_prices_graded")
        .insert({
          card_id: card.id,
          card_name: card.name,
          grade,
          price_usd,
          date: today,
        });

      if (insertError) {
        console.error(`❌ Insert error: ${insertError.message}`);
        errors++;
      } else {
        console.log(`✅ Added ${card.name}: $${price_usd}`);
        updated++;
        results.push({ card: card.name, price_usd });
      }

    } catch (error) {
      console.error(`⚠️ Unexpected error:`, error);
      errors++;
    }
  }

  return new Response(
    JSON.stringify({
      message: `Processed ${CARDS.length} cards`,
      updated,
      noData,
      errors,
      results,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});