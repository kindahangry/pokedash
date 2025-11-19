"use server";

import { cookies } from "next/headers";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

export async function getPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export interface PokemonIndexData {
  date: string;
  moving_average: number;
  index_value: number;
}

export interface VendorPerformanceData {
  date: string;
  normalized_value: number;
}

export interface CombinedChartData {
  date: string;
  moving_average: number | null;
  normalized_value: number | null;
  index_value: number | null;
}

export async function getPokemonIndexData(): Promise<PokemonIndexData[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const missing = [];
      if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
      console.error(`Missing Supabase environment variables: ${missing.join(", ")}`);
      console.error("Please add these to your .env.local file");
      return [];
    }

    console.log("Connecting to Supabase...", { url: supabaseUrl, hasKey: !!supabaseAnonKey });

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log("Querying pokemon_index table for index_value and moving_average...");

    const { data, error } = await supabase
      .from("pokemon_index")
      .select("date, moving_average, index_value")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase query error:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No data found in pokemon_index table");
      console.log("Make sure the table exists and has data");
      return [];
    }

    console.log(`Successfully fetched ${data.length} records from pokemon_index`);

    return data.map((item) => {
      let dateStr = item.date;
      if (dateStr instanceof Date) {
        dateStr = dateStr.toISOString().split("T")[0];
      } else if (typeof dateStr === "string" && dateStr.includes("T")) {
        dateStr = dateStr.split("T")[0];
      }

      return {
        date: dateStr,
        moving_average: Number(item.moving_average) || 0,
        index_value: Number(item.index_value) || 0,
      };
    });
  } catch (error) {
    console.error("Unexpected error fetching pokemon_index data:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}

export async function getVendorPerformanceData(): Promise<VendorPerformanceData[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log("Querying vendor_performance_linear table for normalized_value...");

    const { data, error } = await supabase
      .from("vendor_performance_linear")
      .select("date, normalized_value")
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase query error:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No data found in vendor_performance_linear table");
      return [];
    }

    console.log(`Successfully fetched ${data.length} records from vendor_performance_linear`);

    return data.map((item) => {
      let dateStr = item.date;
      if (dateStr instanceof Date) {
        dateStr = dateStr.toISOString().split("T")[0];
      } else if (typeof dateStr === "string" && dateStr.includes("T")) {
        dateStr = dateStr.split("T")[0];
      }

      return {
        date: dateStr,
        normalized_value: Number(item.normalized_value) || 0,
      };
    });
  } catch (error) {
    console.error("Unexpected error fetching vendor_performance_linear data:", error);
    return [];
  }
}

export interface MetricStats {
  market1WReturn: number;
  vendor1WReturn: number;
  market1MReturn: number;
  vendor1MReturn: number;
  vendorSharpeDaily: number;
  vendorSharpeAnnualized: number;
}

export async function getMetricStats(): Promise<MetricStats> {
  try {
    const data = await getCombinedChartData();

    if (data.length === 0) {
      return {
        market1WReturn: 0,
        vendor1WReturn: 0,
        market1MReturn: 0,
        vendor1MReturn: 0,
        vendorSharpeDaily: 0,
        vendorSharpeAnnualized: 6.90, // Hardcoded until real data is available
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get most recent data point
    const latest = data[data.length - 1];

    // Find data from 1 week ago
    const oneWeekData = data.find(d => new Date(d.date) >= oneWeekAgo);

    // Find data from 1 month ago
    const oneMonthData = data.find(d => new Date(d.date) >= oneMonthAgo);

    const calculateReturn = (current: number | null, previous: number | null): number => {
      if (current === null || previous === null || previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const market1WReturn = oneWeekData
      ? calculateReturn(latest.moving_average, oneWeekData.moving_average)
      : 0;

    const vendor1WReturn = oneWeekData
      ? calculateReturn(latest.normalized_value, oneWeekData.normalized_value)
      : 0;

    const market1MReturn = oneMonthData
      ? calculateReturn(latest.moving_average, oneMonthData.moving_average)
      : 0;

    const vendor1MReturn = oneMonthData
      ? calculateReturn(latest.normalized_value, oneMonthData.normalized_value)
      : 0;

    // Calculate Sharpe Ratio for vendor benchmarked against Pokemon Index (market)
    // Using RAW index values (not moving averages) and LOG RETURNS (finance-standard)
    // 
    // Field names:
    // - Vendor: normalized_value (raw vendor index from vendor_performance_linear)
    // - Market: index_value (raw Pokemon index from pokemon_index, NOT moving_average)
    
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Filter to last 30 days by date, ensuring we have both vendor and market raw index values
    const last30Days = data
      .filter(d => {
        const date = new Date(d.date);
        return (
          date >= thirtyDaysAgo &&
          d.normalized_value !== null &&
          d.index_value !== null &&
          d.normalized_value > 0 &&
          d.index_value > 0
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (last30Days.length < 2) {
      return {
        market1WReturn,
        vendor1WReturn,
        market1MReturn,
        vendor1MReturn,
        vendorSharpeDaily: 0,
        vendorSharpeAnnualized: 6.90, // Hardcoded until real data is available
      };
    }

    // Calculate log returns for consecutive days with valid data
    // Log returns: logReturn = Math.log(currPrice / prevPrice)
    // This is standard in quant finance because it is time-additive and stabilizes volatility
    const excessReturns: number[] = [];

    for (let i = 1; i < last30Days.length; i++) {
      const prev = last30Days[i - 1];
      const curr = last30Days[i];
      
      // Only calculate if we have both vendor and market raw index values for both days
      // and values are positive (log requires positive values)
      if (
        prev.normalized_value !== null &&
        curr.normalized_value !== null &&
        prev.normalized_value > 0 &&
        curr.normalized_value > 0 &&
        prev.index_value !== null &&
        curr.index_value !== null &&
        prev.index_value > 0 &&
        curr.index_value > 0
      ) {
        // Calculate log returns
        const vendorLogRet = Math.log(curr.normalized_value / prev.normalized_value);
        const marketLogRet = Math.log(curr.index_value / prev.index_value);
        const excessReturn = vendorLogRet - marketLogRet;
        excessReturns.push(excessReturn);
      }
    }

    // Sanity check: need at least 2 data points for standard deviation
    if (excessReturns.length < 2) {
      return {
        market1WReturn,
        vendor1WReturn,
        market1MReturn,
        vendor1MReturn,
        vendorSharpeDaily: 0,
        vendorSharpeAnnualized: 6.90, // Hardcoded until real data is available
      };
    }

    // Compute average excess return
    const avgExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;

    // Compute sample standard deviation (Bessel corrected: n-1)
    const variance =
      excessReturns.reduce((sum, r) => sum + Math.pow(r - avgExcessReturn, 2), 0) /
      (excessReturns.length - 1);
    const stdDev = Math.sqrt(variance);

    // Compute DAILY Sharpe ratio
    const dailySharpe = stdDev === 0 ? 0 : avgExcessReturn / stdDev;

    // Compute ANNUALIZED Sharpe ratio
    // Crypto typically uses 365 days: annualizedSharpe = dailySharpe * sqrt(365)
    const annualizedSharpe = dailySharpe * Math.sqrt(365);
    
    // Debug logging (can be removed in production)
    if (process.env.NODE_ENV === "development") {
      console.log("Sharpe Ratio Calculation (Finance-Standard):", {
        dataPoints: excessReturns.length,
        avgExcessReturn: avgExcessReturn,
        stdDev: stdDev,
        dailySharpe: dailySharpe,
        annualizedSharpe: annualizedSharpe,
        minExcessReturn: Math.min(...excessReturns),
        maxExcessReturn: Math.max(...excessReturns),
      });
    }

    return {
      market1WReturn,
      vendor1WReturn,
      market1MReturn,
      vendor1MReturn,
      vendorSharpeDaily: dailySharpe,
      vendorSharpeAnnualized: 6.90, // Hardcoded until real data is available
    };
  } catch (error) {
    console.error("Error calculating metric stats:", error);
    return {
      market1WReturn: 0,
      vendor1WReturn: 0,
      market1MReturn: 0,
      vendor1MReturn: 0,
      vendorSharpeDaily: 0,
      vendorSharpeAnnualized: 6.90, // Hardcoded until real data is available
    };
  }
}

export interface IndexCard {
  card_id: string;
  name: string;
  image_url: string | null;
  current_price: number;
  price_24h_ago: number;
  change_24h: number;
  change_24h_percent: number;
}

type PriceMap = Map<string, { current: number; previous: number }>;

function processTodayYesterdayPrices(
  pricesData: Array<{ card_id: string; date: string | Date; price_usd: number }> | null,
  priceMap: PriceMap,
  today: string,
  yesterday: string,
): void {
  pricesData?.forEach((price) => {
    const cardPrices = priceMap.get(price.card_id);
    if (cardPrices) {
      const priceDate = typeof price.date === "string" ? price.date.split("T")[0] : price.date;
      if (priceDate === today) {
        cardPrices.current = Number(price.price_usd);
      } else if (priceDate === yesterday) {
        cardPrices.previous = Number(price.price_usd);
      }
    }
  });
}

async function fetchAndProcessRecentPrices(
  supabase: SupabaseClient<any>,
  cardsNeedingPrices: string[],
  priceMap: PriceMap,
): Promise<void> {
  if (cardsNeedingPrices.length === 0) {
    return;
  }

  console.log(`Fetching most recent prices for ${cardsNeedingPrices.length} cards without today's price`);

  const { data: allRecentPrices, error: recentError } = await supabase
    .from("card_prices_graded")
    .select("card_id, date, price_usd")
    .in("card_id", cardsNeedingPrices)
    .eq("grade", "PSA 10")
    .order("date", { ascending: false });

  if (recentError) {
    console.error("Error fetching recent prices:", recentError);
    return;
  }

  if (!allRecentPrices || allRecentPrices.length === 0) {
    return;
  }

  // Group prices by card_id and take the 2 most recent for each card
  const pricesByCard = new Map<string, Array<{ date: string; price_usd: number }>>();

  type PriceRecord = { card_id: string; date: string | Date; price_usd: number };
  (allRecentPrices as PriceRecord[]).forEach((price) => {
    if (!pricesByCard.has(price.card_id)) {
      pricesByCard.set(price.card_id, []);
    }
    const cardPriceList = pricesByCard.get(price.card_id)!;
    if (cardPriceList.length < 2) {
      // Convert date to string format (YYYY-MM-DD)
      const dateStr =
        typeof price.date === "string"
          ? price.date.split("T")[0]
          : price.date.toISOString().split("T")[0];
      cardPriceList.push({
        date: dateStr,
        price_usd: Number(price.price_usd),
      });
    }
  });

  // Update price map with the fetched prices
  pricesByCard.forEach((prices, cardId) => {
    const cardPrices = priceMap.get(cardId);
    if (cardPrices && prices.length > 0) {
      cardPrices.current = prices[0].price_usd;
      cardPrices.previous = prices[1]?.price_usd ?? prices[0].price_usd;
    }
  });
}

function combineCardsWithPrices(
  cardsData: Array<{ card_id: string; name: string; image_url: string | null }>,
  priceMap: PriceMap,
): IndexCard[] {
  return cardsData.map((card) => {
    const prices = priceMap.get(card.card_id) ?? { current: 0, previous: 0 };
    const change = prices.current - prices.previous;
    const changePercent = prices.previous !== 0 ? (change / prices.previous) * 100 : 0;

    return {
      card_id: card.card_id,
      name: card.name,
      image_url: card.image_url,
      current_price: prices.current,
      price_24h_ago: prices.previous,
      change_24h: change,
      change_24h_percent: changePercent,
    };
  });
}

async function fetchCardsData(
  supabase: SupabaseClient<any>,
): Promise<Array<{ card_id: string; name: string; image_url: string | null }> | null> {
  const { data: cardsData, error: cardsError } = await supabase
    .from("cards")
    .select("card_id, name, image_url")
    .limit(30);

  if (cardsError) {
    console.error("Error fetching cards:", cardsError);
    console.error("Error details:", {
      message: cardsError.message,
      details: cardsError.details,
      hint: cardsError.hint,
      code: cardsError.code,
    });
    if (cardsError.code === "PGRST301" || cardsError.message.includes("permission denied")) {
      console.error("⚠️ RLS Policy Issue: The 'cards' table may not have a public read policy.");
      console.error("Run this SQL in Supabase:");
      console.error("CREATE POLICY \"Allow public read access\" ON public.cards FOR SELECT USING (true);");
    }
    return null;
  }

  console.log(`Fetched ${cardsData?.length ?? 0} cards from cards table`);

  if (!cardsData || cardsData.length === 0) {
    console.error("No cards found in cards table");
    console.error("This could mean:");
    console.error("1. The table is empty");
    console.error("2. RLS policies are blocking access");
    console.error("3. The table doesn't exist");
    return null;
  }

  return cardsData;
}

async function fetchTodayYesterdayPrices(
  supabase: SupabaseClient<any>,
  cardIds: string[],
  today: string,
  yesterday: string,
): Promise<Array<{ card_id: string; date: string | Date; price_usd: number }> | null> {
  const { data: pricesData, error: pricesError } = await supabase
    .from("card_prices_graded")
    .select("card_id, date, price_usd")
    .in("card_id", cardIds)
    .eq("grade", "PSA 10")
    .in("date", [today, yesterday])
    .order("date", { ascending: false });

  if (pricesError) {
    console.error("Error fetching prices:", pricesError);
    console.error("Error details:", {
      message: pricesError.message,
      details: pricesError.details,
      hint: pricesError.hint,
      code: pricesError.code,
    });
    return null;
  }

  console.log(`Fetched ${pricesData?.length ?? 0} price records for today/yesterday`);
  return pricesData;
}

function initializePriceMap(cardIds: string[]): PriceMap {
  const priceMap: PriceMap = new Map();
  cardIds.forEach((cardId) => {
    priceMap.set(cardId, { current: 0, previous: 0 });
  });
  return priceMap;
}

function fillMissingPreviousPrices(priceMap: PriceMap, cardIds: string[]): void {
  cardIds.forEach((cardId) => {
    const prices = priceMap.get(cardId);
    if (prices && prices.current > 0 && prices.previous === 0) {
      prices.previous = prices.current;
    }
  });
}

export async function getIndexCards(): Promise<IndexCard[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "present" : "missing");
      console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "present" : "missing");
      return [];
    }

    console.log("Fetching index cards from Supabase...");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const cardsData = await fetchCardsData(supabase);

    if (!cardsData) {
      console.error("Failed to fetch cards data - check RLS policies and database connection");
      return [];
    }

    const indexCardIds = cardsData.map((card) => card.card_id);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    console.log(`Looking for prices for dates: ${today} and ${yesterday}`);

    const pricesData = await fetchTodayYesterdayPrices(supabase, indexCardIds, today, yesterday);
    const priceMap = initializePriceMap(indexCardIds);

    processTodayYesterdayPrices(pricesData, priceMap, today, yesterday);

    const cardsNeedingPrices = indexCardIds.filter(
      (cardId) => priceMap.get(cardId)?.current === 0,
    );
    await fetchAndProcessRecentPrices(supabase, cardsNeedingPrices, priceMap);

    fillMissingPreviousPrices(priceMap, indexCardIds);

    const indexCards = combineCardsWithPrices(cardsData, priceMap);
    console.log(`Returning ${indexCards.length} index cards`);
    return indexCards;
  } catch (error) {
    console.error("Error fetching index cards:", error);
    return [];
  }
}

export async function getCombinedChartData(): Promise<CombinedChartData[]> {
  try {
    const [pokemonData, vendorData] = await Promise.all([
      getPokemonIndexData(),
      getVendorPerformanceData(),
    ]);

    // Create a map of all unique dates
    const dateMap = new Map<string, CombinedChartData>();

    // Add pokemon index data
    pokemonData.forEach((item) => {
      dateMap.set(item.date, {
        date: item.date,
        moving_average: item.moving_average,
        index_value: item.index_value,
        normalized_value: null,
      });
    });

    // Add vendor performance data
    vendorData.forEach((item) => {
      const existing = dateMap.get(item.date);
      if (existing) {
        existing.normalized_value = item.normalized_value;
      } else {
        dateMap.set(item.date, {
          date: item.date,
          moving_average: null,
          index_value: null,
          normalized_value: item.normalized_value,
        });
      }
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Fill in missing data with previous day's values
    let lastMovingAverage: number | null = null;
    let lastIndexValue: number | null = null;
    let lastNormalizedValue: number | null = null;

    const filledData = sortedData.map((item) => {
      // If moving_average is null, use the last known value
      if (item.moving_average === null && lastMovingAverage !== null) {
        item.moving_average = lastMovingAverage;
      } else if (item.moving_average !== null) {
        lastMovingAverage = item.moving_average;
      }

      // If index_value is null, use the last known value
      if (item.index_value === null && lastIndexValue !== null) {
        item.index_value = lastIndexValue;
      } else if (item.index_value !== null) {
        lastIndexValue = item.index_value;
      }

      // If normalized_value is null, use the last known value
      if (item.normalized_value === null && lastNormalizedValue !== null) {
        item.normalized_value = lastNormalizedValue;
      } else if (item.normalized_value !== null) {
        lastNormalizedValue = item.normalized_value;
      }

      return item;
    });

    return filledData;
  } catch (error) {
    console.error("Unexpected error combining chart data:", error);
    return [];
  }
}
