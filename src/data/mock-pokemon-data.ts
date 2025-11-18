import type {
  PokemonCard,
  CardPerformance,
  PokemonPriceHistory,
  PerformanceHistory,
} from "@/types/pokemon";

// Mock Pokemon Card Holdings
export const mockPokemonCards: PokemonCard[] = [
  {
    id: "1",
    name: "Charizard VMAX",
    set: "Darkness Ablaze",
    rarity: "Rainbow Rare",
    purchasePrice: 450.0,
    currentPrice: 680.0,
    purchaseDate: "2023-06-15",
    quantity: 2,
  },
  {
    id: "2",
    name: "Pikachu VMAX",
    set: "Vivid Voltage",
    rarity: "Secret Rare",
    purchasePrice: 280.0,
    currentPrice: 320.0,
    purchaseDate: "2023-08-20",
    quantity: 3,
  },
  {
    id: "3",
    name: "Umbreon VMAX",
    set: "Evolving Skies",
    rarity: "Alternate Art",
    purchasePrice: 350.0,
    currentPrice: 520.0,
    purchaseDate: "2023-09-10",
    quantity: 1,
  },
  {
    id: "4",
    name: "Lugia V",
    set: "Silver Tempest",
    rarity: "Full Art",
    purchasePrice: 125.0,
    currentPrice: 145.0,
    purchaseDate: "2024-01-05",
    quantity: 4,
  },
  {
    id: "5",
    name: "Mew VMAX",
    set: "Fusion Strike",
    rarity: "Hyper Rare",
    purchasePrice: 220.0,
    currentPrice: 195.0,
    purchaseDate: "2023-11-12",
    quantity: 2,
  },
];

// Calculate card performance
export const mockCardPerformance: CardPerformance[] = mockPokemonCards.map((card) => {
  const returnDollar = (card.currentPrice - card.purchasePrice) * card.quantity;
  const returnPercent = ((card.currentPrice - card.purchasePrice) / card.purchasePrice) * 100;
  const holdingPeriodDays = Math.floor(
    (new Date().getTime() - new Date(card.purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    cardId: card.id,
    cardName: `${card.name} (${card.set})`,
    purchasePrice: card.purchasePrice,
    currentPrice: card.currentPrice,
    returnPercent,
    returnDollar,
    holdingPeriodDays,
  };
});

// Mock historical price data for a single card (example: Charizard VMAX)
export const mockPriceHistory: PokemonPriceHistory[] = [
  { date: "2023-06-15", price: 450, volume: 12 },
  { date: "2023-07-01", price: 480, volume: 15 },
  { date: "2023-08-01", price: 520, volume: 18 },
  { date: "2023-09-01", price: 510, volume: 14 },
  { date: "2023-10-01", price: 545, volume: 20 },
  { date: "2023-11-01", price: 580, volume: 22 },
  { date: "2023-12-01", price: 600, volume: 25 },
  { date: "2024-01-01", price: 620, volume: 19 },
  { date: "2024-02-01", price: 640, volume: 21 },
  { date: "2024-03-01", price: 660, volume: 23 },
  { date: "2024-04-01", price: 670, volume: 18 },
  { date: "2024-10-01", price: 680, volume: 20 },
];

// Mock overall portfolio performance over time
export const mockPerformanceHistory: PerformanceHistory[] = [
  { date: "2023-06-01", vaultValue: 10000, returnPercent: 0, cumulativeReturn: 0 },
  { date: "2023-07-01", vaultValue: 10500, returnPercent: 5.0, cumulativeReturn: 500 },
  { date: "2023-08-01", vaultValue: 11200, returnPercent: 6.67, cumulativeReturn: 1200 },
  { date: "2023-09-01", vaultValue: 11800, returnPercent: 5.36, cumulativeReturn: 1800 },
  { date: "2023-10-01", vaultValue: 12500, returnPercent: 5.93, cumulativeReturn: 2500 },
  { date: "2023-11-01", vaultValue: 13200, returnPercent: 5.6, cumulativeReturn: 3200 },
  { date: "2023-12-01", vaultValue: 14100, returnPercent: 6.82, cumulativeReturn: 4100 },
  { date: "2024-01-01", vaultValue: 15000, returnPercent: 6.38, cumulativeReturn: 5000 },
  { date: "2024-02-01", vaultValue: 15800, returnPercent: 5.33, cumulativeReturn: 5800 },
  { date: "2024-03-01", vaultValue: 16500, returnPercent: 4.43, cumulativeReturn: 6500 },
  { date: "2024-04-01", vaultValue: 17200, returnPercent: 4.24, cumulativeReturn: 7200 },
  { date: "2024-10-01", vaultValue: 18500, returnPercent: 7.56, cumulativeReturn: 8500 },
];
