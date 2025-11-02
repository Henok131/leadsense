-- Phase 7: Create Database Trigger for Auto-Scoring
-- Run this in your Supabase SQL Editor after deploying the autoScoreLead Edge Function
-- 
-- This trigger will automatically call the autoScoreLead function when a new lead is inserted

-- First, enable the pg_net extension (required for HTTP requests)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to call the Edge Function when a new lead is inserted
CREATE OR REPLACE FUNCTION trigger_auto_score_lead()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  supabase_service_role_key TEXT;
BEGIN
  -- Get environment variables (set these in Supabase Dashboard > Settings > Database > Secrets)
  supabase_url := current_setting('app.supabase_url', true);
  supabase_service_role_key := current_setting('app.supabase_service_role_key', true);

  -- If environment variables are not set, use fallback (you can set these in Supabase Dashboard)
  IF supabase_url IS NULL THEN
    supabase_url := 'https://' || current_setting('app.project_ref', true) || '.supabase.co';
  END IF;

  -- Call the Edge Function asynchronously (fire and forget)
  -- This prevents blocking the INSERT operation
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/autoScoreLead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(supabase_service_role_key, current_setting('app.supabase_service_role_key', true))
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'leads',
      'record', row_to_json(NEW)
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on leads table
DROP TRIGGER IF EXISTS trigger_auto_score_lead_on_insert ON leads;
CREATE TRIGGER trigger_auto_score_lead_on_insert
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_auto_score_lead();

-- Optional: Add a comment explaining the trigger
COMMENT ON TRIGGER trigger_auto_score_lead_on_insert ON leads IS 
  'Automatically scores new leads using OpenAI when inserted into the leads table';

-- Alternative: If you prefer to use Supabase Database Webhooks instead of triggers
-- Go to Supabase Dashboard > Database > Webhooks > Create Webhook
-- Event: INSERT
-- Table: leads
-- URL: https://<your-project>.supabase.co/functions/v1/autoScoreLead
-- HTTP Method: POST
-- HTTP Headers: Authorization: Bearer <service_role_key>

