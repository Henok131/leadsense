-- Supabase Table Schema for Asenay Leadsense

-- Create leads table
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  company text,
  message text,
  score int,
  category text,
  tags text[],
  source text default 'form',
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table leads enable row level security;

-- Create policy to allow insert operations
create policy "Allow insert" on leads
for insert using (true);

-- Optional: Create policy to allow select operations (adjust as needed for your security requirements)
-- create policy "Allow select" on leads
-- for select using (true);

