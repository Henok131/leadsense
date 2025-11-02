-- Phase 7: AI Scoring & Automation Layer - Database Schema Updates
-- Run this in your Supabase SQL Editor

-- Add AI scoring columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score INT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_reason TEXT;

-- Add scoring metadata and timestamps
ALTER TABLE leads ADD COLUMN IF NOT EXISTS scoring_metadata JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_scored_at TIMESTAMPTZ;

-- Create index for faster queries on AI scores
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score);
CREATE INDEX IF NOT EXISTS idx_leads_last_scored_at ON leads(last_scored_at);

-- Optional: Add comment for documentation
COMMENT ON COLUMN leads.ai_score IS 'AI-generated lead score (0-100)';
COMMENT ON COLUMN leads.ai_reason IS 'AI explanation for the score';
COMMENT ON COLUMN leads.scoring_metadata IS 'Metadata about the scoring (model, usage, etc.)';
COMMENT ON COLUMN leads.last_scored_at IS 'Timestamp of last AI scoring';

-- Optional: Create a function to automatically score leads on insert
-- This can be used as an alternative to the Edge Function approach
CREATE OR REPLACE FUNCTION auto_score_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- This would call the Edge Function or use a database extension
  -- For now, we'll use the Edge Function approach
  PERFORM net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/autoScoreLead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
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

-- Optional: Create trigger to auto-score on insert
-- Uncomment if you want to use database function instead of Edge Function
-- DROP TRIGGER IF EXISTS trigger_auto_score_lead ON leads;
-- CREATE TRIGGER trigger_auto_score_lead
--   AFTER INSERT ON leads
--   FOR EACH ROW
--   EXECUTE FUNCTION auto_score_lead();

-- Optional: Create a function for batch rescoring (for cron jobs)
CREATE OR REPLACE FUNCTION get_leads_for_rescoring(days_old INTEGER DEFAULT 7)
RETURNS TABLE(
  id UUID,
  name TEXT,
  email TEXT,
  company TEXT,
  message TEXT,
  source TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.email,
    l.company,
    l.message,
    l.source,
    l.created_at,
    l.updated_at
  FROM leads l
  WHERE
    (l.created_at >= NOW() - (days_old || ' days')::INTERVAL
     OR l.updated_at >= NOW() - (days_old || ' days')::INTERVAL)
    AND l.name IS NOT NULL
    AND l.email IS NOT NULL
  ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql;

