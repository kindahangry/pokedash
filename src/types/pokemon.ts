// Pokemon Card Investment Types
export interface PokemonCard {
  id: string;
  name: string;
  set: string;
  rarity: string;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  quantity: number;
}

export interface PokemonPriceHistory {
  date: string;
  price: number;
  volume?: number;
}

export interface CardPerformance {
  cardId: string;
  cardName: string;
  purchasePrice: number;
  currentPrice: number;
  returnPercent: number;
  returnDollar: number;
  holdingPeriodDays: number;
}

// Vendor Performance Types
export interface VendorSale {
  id: string;
  date: string;
  cardName: string;
  salePrice: number;
  costBasis: number;
  profit: number;
  profitMargin: number;
  platform: string;
}

export interface VendorMetrics {
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageMargin: number;
  numberOfTransactions: number;
}

export interface VendorPerformanceByMonth {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  transactions: number;
}

// Vault/Investment Types
export interface VaultMetrics {
  totalDeposits: number;
  currentValue: number;
  totalReturn: number;
  returnPercent: number;
  performanceFee: number;
  netReturn: number;
}

export interface DepositHistory {
  date: string;
  amount: number;
  depositor: string;
  transactionHash?: string;
}

export interface PerformanceHistory {
  date: string;
  vaultValue: number;
  returnPercent: number;
  cumulativeReturn: number;
}
