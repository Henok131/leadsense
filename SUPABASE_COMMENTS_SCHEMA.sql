-- Phase 5: Comments & Collaboration Schema
-- Run this in your Supabase SQL Editor

-- Comments table
create table if not exists comments (
  id bigint primary key generated always as identity,
  lead_id uuid references leads(id) on delete cascade,
  user_id text not null, -- Simple text identifier for now (can be email/username)
  user_name text not null,
  text text not null,
  parent_id bigint references comments(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notifications table (for mentions)
create table if not exists notifications (
  id bigint primary key generated always as identity,
  recipient text not null,
  comment_id bigint references comments(id) on delete cascade,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table comments enable row level security;
alter table notifications enable row level security;

-- RLS Policies for Comments
-- Allow all authenticated users to read comments
create policy "Allow read comments" on comments
  for select
  using (true);

-- Allow all authenticated users to insert comments
create policy "Allow insert comments" on comments
  for insert
  with check (true);

-- Allow users to update their own comments
create policy "Allow update own comments" on comments
  for update
  using (true);

-- Allow users to delete their own comments
create policy "Allow delete own comments" on comments
  for delete
  using (true);

-- RLS Policies for Notifications
-- Allow users to read their own notifications
create policy "Allow read own notifications" on notifications
  for select
  using (true);

-- Allow insert notifications
create policy "Allow insert notifications" on notifications
  for insert
  with check (true);

-- Allow update notifications
create policy "Allow update notifications" on notifications
  for update
  using (true);

-- Create indexes for performance
create index idx_comments_lead_id on comments(lead_id);
create index idx_comments_parent_id on comments(parent_id);
create index idx_comments_created_at on comments(created_at desc);
create index idx_notifications_recipient on notifications(recipient);
create index idx_notifications_is_read on notifications(is_read);

