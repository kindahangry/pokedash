import Image from "next/image";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getIndexCards } from "@/server/server-actions";

// Add revalidation to cache the page for 60 seconds
export const revalidate = 60;

export default async function MarketPage() {
  const indexCards = await getIndexCards();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Market Overview</h1>
        <p className="text-muted-foreground">Pokemon Index Cards - Live prices and 24h changes</p>
      </div>

      {/* Index Cards Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Pokemon Index Cards</CardTitle>
          <CardDescription>All 30 cards in the index with current prices (PSA 10)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {indexCards.map((card) => (
              <div
                key={card.card_id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col gap-3"
              >
                {/* Card Image */}
                <div className="relative w-full aspect-[3/4] bg-muted rounded-md overflow-hidden">
                  {card.image_url ? (
                    <Image
                      src={card.image_url}
                      alt={card.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-sm line-clamp-2">{card.name}</h3>

                  {/* Current Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">${card.current_price.toLocaleString()}</span>
                  </div>

                  {/* 24h Change */}
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      card.change_24h > 0
                        ? "text-green-600"
                        : card.change_24h < 0
                          ? "text-red-600"
                          : "text-gray-500"
                    }`}
                  >
                    {card.change_24h > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : card.change_24h < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                    <span>
                      {card.change_24h > 0 ? "+" : ""}
                      {card.change_24h_percent.toFixed(2)}%
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({card.change_24h > 0 ? "+" : ""}${card.change_24h.toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {indexCards.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No card data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
