-- Update cron job to call card-prices-all with proper authentication
-- Run this in your Supabase SQL Editor

-- Step 1: View existing cron jobs
SELECT jobid, jobname, schedule, command
FROM cron.job
WHERE command LIKE '%card-prices%';

-- Step 2: Delete the old card-prices cron job (if it exists)
-- Replace 'card_prices_daily' with your actual job name from Step 1
-- SELECT cron.unschedule('card_prices_daily');

-- Step 3: Create new cron job for card-prices-all
-- This runs daily at 6 AM UTC
-- Replace YOUR_SERVICE_ROLE_KEY with your actual service role key from:
-- Supabase Dashboard > Settings > API > service_role key

DO $$
DECLARE
  service_role_key TEXT := 'YOUR_SERVICE_ROLE_KEY'; -- ⚠️ REPLACE THIS
  supabase_url TEXT := 'https://jbcrntbwijmsbpebyeiq.supabase.co';
  function_url TEXT := supabase_url || '/functions/v1/card-prices-all';
BEGIN
  PERFORM cron.schedule(
    'card_prices_daily_batched',           -- Job name
    '0 6 * * *',                           -- Schedule: 6 AM UTC daily
    format(
      'SELECT net.http_post(
        url := %L,
        headers := jsonb_build_object(
          ''Content-Type'', ''application/json'',
          ''Authorization'', ''Bearer %s''
        ),
        body := ''{}''::jsonb
      )',
      function_url,
      service_role_key
    )
  );

  RAISE NOTICE 'Created cron job: card_prices_daily_batched';
END $$;

-- Step 4: Verify the new cron job was created
SELECT jobid, jobname, schedule, command
FROM cron.job
WHERE jobname = 'card_prices_daily_batched';
