import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockVendorSales,
  mockVendorMetrics,
  mockVendorPerformanceByMonth,
  mockPlatformPerformance,
} from "@/data/mock-vendor-data";

export default function VendorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Performance</h1>
        <p className="text-muted-foreground">Pokemon card sales and vendor operation metrics</p>
      </div>

      {/* Vendor Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">${mockVendorMetrics.totalRevenue.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Profit</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              ${mockVendorMetrics.totalProfit.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Margin</CardDescription>
            <CardTitle className="text-2xl">{mockVendorMetrics.averageMargin.toFixed(2)}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sales</CardDescription>
            <CardTitle className="text-2xl">{mockVendorMetrics.numberOfTransactions}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest vendor transactions and profitability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Card</th>
                  <th className="text-right p-2">Sale Price</th>
                  <th className="text-right p-2">Cost</th>
                  <th className="text-right p-2">Profit</th>
                  <th className="text-right p-2">Margin</th>
                  <th className="text-left p-2">Platform</th>
                </tr>
              </thead>
              <tbody>
                {mockVendorSales.map((sale) => (
                  <tr key={sale.id} className="border-b">
                    <td className="p-2 text-sm">{sale.date}</td>
                    <td className="p-2 text-sm">{sale.cardName}</td>
                    <td className="text-right p-2">${sale.salePrice.toFixed(2)}</td>
                    <td className="text-right p-2">${sale.costBasis.toFixed(2)}</td>
                    <td className={`text-right p-2 ${sale.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${sale.profit.toFixed(2)}
                    </td>
                    <td
                      className={`text-right p-2 ${sale.profitMargin >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {sale.profitMargin.toFixed(2)}%
                    </td>
                    <td className="p-2 text-sm">{sale.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Vendor revenue and profit by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockVendorPerformanceByMonth.slice(-6).map((month) => (
                <div key={month.month} className="border-b pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">{month.month}</span>
                    <span className="text-sm text-green-600">{month.margin.toFixed(2)}% margin</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Revenue: ${month.revenue.toLocaleString()}</span>
                    <span>Profit: ${month.profit.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{month.transactions} transactions</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Sales performance by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPlatformPerformance.map((platform) => (
                <div key={platform.platform} className="border-b pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{platform.platform}</span>
                    <span className="text-sm text-green-600">{platform.margin.toFixed(2)}% margin</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Sales</div>
                      <div className="font-medium">{platform.sales}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Revenue</div>
                      <div className="font-medium">${platform.revenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Profit</div>
                      <div className="font-medium text-green-600">${platform.profit.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
