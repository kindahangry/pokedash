import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricStats } from "@/server/server-actions";

export async function SectionCards() {
  const stats = await getMetricStats();

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const formatSharpe = (value: number) => {
    return value.toFixed(2);
  };

  const getSharpeLabel = (value: number) => {
    if (value > 2) return "Excellent";
    if (value > 1) return "Good";
    if (value > 0) return "Fair";
    return "Poor";
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-5">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Market 1W Return</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(stats.market1WReturn)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.market1WReturn >= 0 ? <TrendingUp /> : <TrendingDown />}
              {formatPercentage(stats.market1WReturn)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.market1WReturn >= 0 ? "Strong" : "Weak"} weekly performance{" "}
            {stats.market1WReturn >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">7-day market returns</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Vendor 1W Return</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(stats.vendor1WReturn)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.vendor1WReturn >= 0 ? <TrendingUp /> : <TrendingDown />}
              {formatPercentage(stats.vendor1WReturn)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.vendor1WReturn >= 0 ? "Positive" : "Negative"} vendor gains{" "}
            {stats.vendor1WReturn >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {stats.vendor1WReturn > stats.market1WReturn ? "Outperforming market" : "Trailing market"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Market 1M Return</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(stats.market1MReturn)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.market1MReturn >= 0 ? <TrendingUp /> : <TrendingDown />}
              {formatPercentage(stats.market1MReturn)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.market1MReturn >= 0 ? "Strong" : "Weak"} monthly growth{" "}
            {stats.market1MReturn >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">30-day performance</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Vendor 1M Return</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercentage(stats.vendor1MReturn)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.vendor1MReturn >= 0 ? <TrendingUp /> : <TrendingDown />}
              {formatPercentage(stats.vendor1MReturn)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.vendor1MReturn >= 0 ? "Solid" : "Declining"} monthly returns{" "}
            {stats.vendor1MReturn >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {stats.vendor1MReturn > stats.market1MReturn ? "Beating market" : "Below market"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Vendor Sharpe Ratio</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatSharpe(stats.vendorSharpeRatio)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.vendorSharpeRatio >= 0 ? <TrendingUp /> : <TrendingDown />}
              {getSharpeLabel(stats.vendorSharpeRatio)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.vendorSharpeRatio >= 0 ? "Outperforming" : "Underperforming"} market{" "}
            {stats.vendorSharpeRatio >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Risk-adjusted vs Pokemon Index</div>
        </CardFooter>
      </Card>
    </div>
  );
}
