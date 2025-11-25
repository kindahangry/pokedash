// src/scripts/card-prices.js
// CommonJS version for GitHub Actions (Node 18, no "type": "module")

const { createClient } = require("@supabase/supabase-js");

const API_KEY = process.env.CARDHEDGER_API_KEY;
const API_URL = "https://api.cardhedger.com/v1/cards/prices-by-card";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function fetchPrice(card) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ card_id: card.id, grade: "psa10" }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const json = await res.json();

  if (!json.prices || json.prices.length === 0) {
    throw new Error("No price returned");
  }

  const latest = json.prices[0];
  const price =
    typeof latest.price === "string" ? parseFloat(latest.price) : latest.price;

  if (!Number.isFinite(price)) {
    throw new Error(`Invalid price value: ${latest.price}`);
  }

  return price;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const today = new Date().toISOString().split("T")[0];
  const grade = "PSA 10";

  const rows = [];

  for (const card of CARDS) {
    try {
      const price = await fetchPrice(card);
      console.log(`API price for ${card.name}: $${price}`);

      rows.push({
        card_id: card.id,
        card_name: card.name,
        grade,
        price_usd: price,
        date: today,
      });

      // small delay to be nice to API
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`Error for ${card.name}:`, err.message || err);
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase.from("card_prices_graded").insert(rows);
    if (error) {
      console.error("Supabase insert error:", error.message || error);
      process.exitCode = 1;
      return;
    }
    console.log(`Inserted ${rows.length} rows.`);
  } else {
    console.log("No rows to insert.");
  }
}

main().catch((err) => {
  console.error("Fatal error in card price script:", err);
  process.exit(1);
});