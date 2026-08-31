-- Run once in Supabase SQL Editor.
-- Supabase/Postgres cron uses UTC. 20:30 UTC = 00:00 in Iran (UTC+03:30).
create extension if not exists pg_cron;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM cron.job
    WHERE jobname = 'car-estimator-public-messages-nightly-cleanup'
  ) THEN
    PERFORM cron.schedule(
      'car-estimator-public-messages-nightly-cleanup',
      '30 20 * * *',
      $job$delete from public.public_messages;$job$
    );
  END IF;
END
$$;
