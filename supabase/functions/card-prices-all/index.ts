// @ts-nocheck
/// <reference path="../deno.d.ts" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const FUNCTION_URL = Deno.env.get("SUPABASE_URL") + "/functions/v1/card-prices";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TOTAL_CARDS = 30;
const BATCH_SIZE = 10;
const TOTAL_BATCHES = Math.ceil(TOTAL_CARDS / BATCH_SIZE);

serve(async (_req: Request) => {
  console.log(`📊 Starting card price update for ${TOTAL_CARDS} cards in ${TOTAL_BATCHES} batches...\n`);

  const startTime = Date.now();
  let successCount = 0;
  let totalUpdated = 0;
  let totalNoData = 0;
  let totalErrors = 0;

  for (let i = 0; i < TOTAL_BATCHES; i++) {
    console.log(`🚀 Running batch ${i + 1}/${TOTAL_BATCHES}...`);

    try {
      const response = await fetch(`${FUNCTION_URL}?batch=${i}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`❌ Batch ${i + 1} failed: HTTP ${response.status}`);
        const text = await response.text();
        console.error(text);
        continue;
      }

      const result = await response.json();
      console.log(`✅ Batch ${i + 1} complete:`, result.summary);

      successCount++;
      totalUpdated += result.summary.updated || 0;
      totalNoData += result.summary.noData || 0;
      totalErrors += result.summary.errors || 0;

      // Small delay between batches
      if (i < TOTAL_BATCHES - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Batch ${i + 1} error:`, error);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n${"=".repeat(50)}`);
  console.log(`📈 All batches complete!`);
  console.log(`   ✅ Successful batches: ${successCount}/${TOTAL_BATCHES}`);
  console.log(`   📝 Cards updated: ${totalUpdated}`);
  console.log(`   ⚠️  No data: ${totalNoData}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log(`   ⏱️  Duration: ${duration}s`);
  console.log(`${"=".repeat(50)}\n`);

  return new Response(
    JSON.stringify({
      message: `Processed all ${TOTAL_BATCHES} batches`,
      summary: {
        successfulBatches: successCount,
        totalBatches: TOTAL_BATCHES,
        updated: totalUpdated,
        noData: totalNoData,
        errors: totalErrors,
        durationSeconds: parseFloat(duration),
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
