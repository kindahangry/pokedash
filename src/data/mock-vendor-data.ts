import type { VendorSale, VendorMetrics, VendorPerformanceByMonth } from "@/types/pokemon";

// Mock vendor sales transactions
export const mockVendorSales: VendorSale[] = [
  {
    id: "1",
    date: "2024-10-15",
    cardName: "Charizard VMAX (Darkness Ablaze)",
    salePrice: 720.0,
    costBasis: 450.0,
    profit: 270.0,
    profitMargin: 37.5,
    platform: "TCGPlayer",
  },
  {
    id: "2",
    date: "2024-10-12",
    cardName: "Pikachu VMAX (Vivid Voltage)",
    salePrice: 340.0,
    costBasis: 280.0,
    profit: 60.0,
    profitMargin: 17.65,
    platform: "eBay",
  },
  {
    id: "3",
    date: "2024-10-08",
    cardName: "Umbreon VMAX (Evolving Skies)",
    salePrice: 550.0,
    costBasis: 350.0,
    profit: 200.0,
    profitMargin: 36.36,
    platform: "Local Card Shop",
  },
  {
    id: "4",
    date: "2024-10-05",
    cardName: "Lugia V (Silver Tempest)",
    salePrice: 155.0,
    costBasis: 125.0,
    profit: 30.0,
    profitMargin: 19.35,
    platform: "TCGPlayer",
  },
  {
    id: "5",
    date: "2024-09-28",
    cardName: "Mew VMAX (Fusion Strike)",
    salePrice: 210.0,
    costBasis: 220.0,
    profit: -10.0,
    profitMargin: -4.76,
    platform: "eBay",
  },
  {
    id: "6",
    date: "2024-09-20",
    cardName: "Rayquaza VMAX (Evolving Skies)",
    salePrice: 480.0,
    costBasis: 320.0,
    profit: 160.0,
    profitMargin: 33.33,
    platform: "TCGPlayer",
  },
  {
    id: "7",
    date: "2024-09-15",
    cardName: "Mewtwo V-UNION",
    salePrice: 280.0,
    costBasis: 200.0,
    profit: 80.0,
    profitMargin: 28.57,
    platform: "Local Card Shop",
  },
  {
    id: "8",
    date: "2024-09-10",
    cardName: "Giratina VSTAR (Lost Origin)",
    salePrice: 190.0,
    costBasis: 150.0,
    profit: 40.0,
    profitMargin: 21.05,
    platform: "eBay",
  },
];

// Calculate overall vendor metrics
export const mockVendorMetrics: VendorMetrics = {
  totalSales: mockVendorSales.length,
  totalRevenue: mockVendorSales.reduce((sum, sale) => sum + sale.salePrice, 0),
  totalCost: mockVendorSales.reduce((sum, sale) => sum + sale.costBasis, 0),
  totalProfit: mockVendorSales.reduce((sum, sale) => sum + sale.profit, 0),
  averageMargin:
    mockVendorSales.reduce((sum, sale) => sum + sale.profitMargin, 0) / mockVendorSales.length,
  numberOfTransactions: mockVendorSales.length,
};

// Mock monthly vendor performance
export const mockVendorPerformanceByMonth: VendorPerformanceByMonth[] = [
  { month: "2024-04", revenue: 1250.0, cost: 920.0, profit: 330.0, margin: 26.4, transactions: 3 },
  { month: "2024-05", revenue: 1580.0, cost: 1100.0, profit: 480.0, margin: 30.38, transactions: 4 },
  { month: "2024-06", revenue: 1820.0, cost: 1300.0, profit: 520.0, margin: 28.57, transactions: 5 },
  { month: "2024-07", revenue: 2100.0, cost: 1450.0, profit: 650.0, margin: 30.95, transactions: 6 },
  { month: "2024-08", revenue: 1950.0, cost: 1380.0, profit: 570.0, margin: 29.23, transactions: 5 },
  { month: "2024-09", revenue: 2240.0, cost: 1590.0, profit: 650.0, margin: 29.02, transactions: 7 },
  { month: "2024-10", revenue: 2055.0, cost: 1425.0, profit: 630.0, margin: 30.66, transactions: 5 },
];

// Platform performance breakdown
export const mockPlatformPerformance = [
  { platform: "TCGPlayer", sales: 12, revenue: 4280.0, profit: 1250.0, margin: 29.21 },
  { platform: "eBay", sales: 8, revenue: 2890.0, profit: 780.0, margin: 26.99 },
  { platform: "Local Card Shop", sales: 5, revenue: 2140.0, profit: 680.0, margin: 31.78 },
];
