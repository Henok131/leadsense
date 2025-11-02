-- Phase 7: Create Database Trigger for Auto-Scoring
-- Run this in your Supabase SQL Editor after deploying the autoScoreLead Edge Function
-- 
-- This trigger will automatically call the autoScoreLead Edge Function when a new lead is inserted

-- Step 1: Enable the pg_net extension (required for HTTP requests from database)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 2: Create a function to call the Edge Function when a new lead is inserted
CREATE OR REPLACE FUNCTION trigger_auto_score_lead()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url TEXT;
  supabase_service_role_key TEXT;
  function_url TEXT;
BEGIN
  -- Get Supabase project URL (replace with your actual project URL if needed)
  -- Option 1: Use environment variable (set in Supabase Dashboard > Settings > Database > Secrets)
  supabase_url := current_setting('app.supabase_url', true);
  
  -- Option 2: Build from project reference
  IF supabase_url IS NULL OR supabase_url = '' THEN
    -- Extract project reference from current database (if available)
    -- Or manually set: supabase_url := 'https://your-project-id.supabase.co';
    supabase_url := 'https://vwryhloimldyajtobnol.supabase.co';
  END IF;

  -- Get service role key (set in Supabase Dashboard > Settings > Database > Secrets)
  supabase_service_role_key := current_setting('app.supabase_service_role_key', true);
  
  IF supabase_service_role_key IS NULL OR supabase_service_role_key = '' THEN
    -- Fallback: You can set this in Supabase Dashboard > Settings > Database > Secrets
    -- Or pass it as a parameter
    RAISE WARNING 'Supabase service role key not set. Set it in Dashboard > Settings > Database > Secrets';
    -- Return NEW anyway to allow the INSERT to proceed
    RETURN NEW;
  END IF;

  -- Build the Edge Function URL
  -- Format: https://<project-id>.supabase.co/functions/v1/autoScoreLead
  function_url := supabase_url || '/functions/v1/autoScoreLead';

  -- Call the Edge Function asynchronously (fire and forget to avoid blocking INSERT)
  -- This uses pg_net to make an HTTP POST request
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || supabase_service_role_key
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'leads',
      'record', row_to_json(NEW)
    )
  );

  -- Return NEW to allow the INSERT to proceed
  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block the INSERT
    RAISE WARNING 'Failed to trigger auto-scoring for lead %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger on the leads table
DROP TRIGGER IF EXISTS trigger_auto_score_lead_on_insert ON leads;
CREATE TRIGGER trigger_auto_score_lead_on_insert
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_auto_score_lead();

-- Step 4: Add a comment explaining the trigger
COMMENT ON TRIGGER trigger_auto_score_lead_on_insert ON leads IS 
  'Automatically scores new leads using OpenAI when inserted into the leads table. Calls the autoScoreLead Edge Function.';

-- Verify the trigger was created
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_score_lead_on_insert';

-- ============================================================================
-- ALTERNATIVE: Using Supabase Database Webhooks (Recommended for Production)
-- ============================================================================
-- 
-- Instead of using database triggers with pg_net, you can use Supabase Database Webhooks:
-- 
-- Steps:
-- 1. Go to Supabase Dashboard > Database > Webhooks
-- 2. Click "Create a new webhook"
-- 3. Configure:
--    - Name: "Auto Score Lead"
--    - Table: leads
--    - Events: INSERT
--    - HTTP Request:
--      - URL: https://vwryhloimldyajtobnol.supabase.co/functions/v1/autoScoreLead
--      - Method: POST
--      - HTTP Headers:
--        - Authorization: Bearer <YOUR_SERVICE_ROLE_KEY>
--        - Content-Type: application/json
--      - Payload:
--        {
--          "type": "INSERT",
--          "table": "leads",
--          "record": {{ $json }}
--        }
--
-- Benefits of Webhooks:
-- - More reliable than database triggers
-- - Better error handling and retry logic
-- - Easier to monitor and debug
-- - No need for pg_net extension
--
-- ============================================================================
-- SETUP: Environment Variables (Secrets)
-- ============================================================================
--
-- To set the Supabase URL and Service Role Key as secrets:
--
-- Option 1: Via Supabase Dashboard
-- 1. Go to Supabase Dashboard > Settings > Database > Secrets
-- 2. Add secrets:
--    - app.supabase_url = https://vwryhloimldyajtobnol.supabase.co
--    - app.supabase_service_role_key = <your-service-role-key>
--
-- Option 2: Via SQL (one-time setup)
-- ALTER DATABASE postgres SET app.supabase_url = 'https://vwryhloimldyajtobnol.supabase.co';
-- ALTER DATABASE postgres SET app.supabase_service_role_key = '<your-service-role-key>';
--
-- Note: Replace 'vwryhloimldyajtobnol' with your actual Supabase project reference
-- Note: Get your service role key from Supabase Dashboard > Settings > API > service_role (secret)
