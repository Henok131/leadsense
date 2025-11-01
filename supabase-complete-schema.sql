-- Complete Supabase Table Schema for Asenay Leadsense
-- Use this if you need to recreate the table from scratch

-- Drop table if exists (CAUTION: This will delete all existing data!)
-- DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table with all fields
CREATE TABLE IF NOT EXISTS leads (
  -- Primary Key
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info (Required)
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  website text,
  
  -- Lead Content
  message text NOT NULL,
  tags text[],
  interest_category text,
  
  -- Qualification & Scoring
  score integer,
  category text, -- 'Hot', 'Warm', 'Cold'
  status text DEFAULT 'New', -- 'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'
  deal_value numeric,
  contact_preference text, -- 'Email', 'Call', 'WhatsApp'
  
  -- Metadata (Auto-filled)
  source text DEFAULT 'form',
  ip_address text,
  location text,
  user_agent text,
  
  -- CRM Fields (Internal use - not in public form)
  assigned_to text,
  last_contacted_at timestamp with time zone,
  internal_notes text,
  
  -- System Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert operations (public form submission)
CREATE POLICY "Allow insert" ON leads
FOR INSERT 
USING (true);

-- Create policy to allow select operations (for dashboard - adjust as needed)
CREATE POLICY "Allow select" ON leads
FOR SELECT 
USING (true);

-- Create policy to allow update operations (for internal use)
CREATE POLICY "Allow update" ON leads
FOR UPDATE 
USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Add trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verify table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

