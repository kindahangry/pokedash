-- Fix cron job to include Authorization header for card-prices function
-- 
-- IMPORTANT: First, make sure you've deployed the function with verify_jwt = false
-- Run: supabase functions deploy card-prices
--
-- If that doesn't work, use this SQL to add an Authorization header to your cron job.
-- You have two options:
-- 1. Use the anon key (simpler, works with verify_jwt = false)
-- 2. Use the service role key (more secure, works even with verify_jwt = true)

-- Option 1: View existing cron jobs to find the one calling card-prices
SELECT jobid, jobname, schedule, command 
FROM cron.job 
WHERE command LIKE '%card-prices%';

-- Option 2: Update existing cron job with anon key (works with verify_jwt = false)
-- Replace 'your_cron_job_name' with the actual job name from the query above
-- Replace 'YOUR_ANON_KEY' with your anon key from Supabase Dashboard > Settings > API
DO $$
DECLARE
  anon_key TEXT := 'YOUR_ANON_KEY'; -- Get from Supabase Dashboard > Settings > API > anon/public key
  supabase_url TEXT := 'https://jbcrntbwijmsbpebyeiq.supabase.co';
  function_url TEXT := supabase_url || '/functions/v1/card-prices';
  job_name TEXT := 'your_cron_job_name'; -- Replace with your actual cron job name
BEGIN
  PERFORM cron.alter_job(
    job_id := (SELECT jobid FROM cron.job WHERE jobname = job_name LIMIT 1),
    schedule := NULL,
    command := format(
      'SELECT net.http_post(
        url := %L,
        headers := jsonb_build_object(
          ''Content-Type'', ''application/json'',
          ''Authorization'', ''Bearer %s''
        ),
        body := ''{}''::jsonb
      )',
      function_url,
      anon_key
    )
  );
  
  RAISE NOTICE 'Updated cron job: %', job_name;
END $$;

-- Option 3: Alternative using service role key (more secure)
-- Use this if verify_jwt = false doesn't work after redeployment
-- Replace 'YOUR_SERVICE_ROLE_KEY' with service_role key from Supabase Dashboard
/*
DO $$
DECLARE
  service_role_key TEXT := 'YOUR_SERVICE_ROLE_KEY';
  supabase_url TEXT := 'https://jbcrntbwijmsbpebyeiq.supabase.co';
  function_url TEXT := supabase_url || '/functions/v1/card-prices';
  job_name TEXT := 'your_cron_job_name';
BEGIN
  PERFORM cron.alter_job(
    job_id := (SELECT jobid FROM cron.job WHERE jobname = job_name LIMIT 1),
    schedule := NULL,
    command := format(
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
END $$;
*/

