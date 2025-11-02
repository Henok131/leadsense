-- Migration Script: Add Missing Columns to leads Table
-- Run this in Supabase SQL Editor to add all required fields

-- Add missing basic info fields
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS website text;

-- Add message field (if not already exists)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS message text;

-- Add tags field (if not already exists as array)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS tags text[];

-- Add interest category field
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS interest_category text;

-- Add scoring fields (if not already exists)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS score integer,
ADD COLUMN IF NOT EXISTS category text;

-- Add status field with default value
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'New';

-- Add deal value field
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS deal_value numeric;

-- Add contact preference field
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS contact_preference text;

-- Add source field (if not already exists)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'form';

-- Add metadata fields
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS user_agent text;

-- Add system timestamp fields (if not already exists)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Verify all columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

