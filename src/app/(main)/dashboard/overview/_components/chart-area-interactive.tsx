"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

import { getCombinedChartData, type CombinedChartData } from "@/server/server-actions";

export const description = "Pokemon Index & Vendor Performance";

const chartConfig = {
  moving_average: {
    label: "Pokemon Index",
    color: "var(--chart-1)",
  },
  normalized_value: {
    label: "Vendor Performance",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("1y");
  const [chartData, setChartData] = React.useState<CombinedChartData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (isMobile) {
      setTimeRange("90d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getCombinedChartData();
        console.log("Fetched combined data:", data.length, "records");
        if (data.length > 0) {
          console.log("Sample data:", data[0]);
        }
        setChartData(data);
      } catch (error) {
        console.error("Error fetching combined chart data:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const now = new Date();
    let daysToSubtract = 365;
    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "1y") {
      daysToSubtract = 365;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [chartData, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Pokemon Index & Vendor Performance</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Historical performance comparison</span>
          <span className="@[540px]/card:hidden">Performance</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="1y">1 Year</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          {isMounted ? (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="1 Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1y" className="rounded-lg">
                  1 Year
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-8 w-40 items-center justify-center @[767px]/card:hidden">
              <span className="text-sm text-muted-foreground">1 Year</span>
            </div>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPokemon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-moving_average)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-moving_average)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillVendor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-normalized_value)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-normalized_value)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : Math.min(10, filteredData.length - 1)}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                    itemSorter={(item) => {
                      // Return negative value for moving_average to show it first
                      return item.dataKey === "moving_average" ? -1 : 1;
                    }}
                  />
                }
              />
              <Area
                dataKey="normalized_value"
                type="natural"
                fill="url(#fillVendor)"
                stroke="var(--color-normalized_value)"
                stackId="b"
              />
              <Area
                dataKey="moving_average"
                type="natural"
                fill="url(#fillPokemon)"
                stroke="var(--color-moving_average)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
