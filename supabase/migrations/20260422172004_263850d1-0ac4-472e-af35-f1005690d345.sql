-- analytics_events
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid,
  session_id text,
  path text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_analytics_events_created_at on public.analytics_events(created_at desc);
create index idx_analytics_events_name on public.analytics_events(event_name);

alter table public.analytics_events enable row level security;

create policy "Anyone can insert events"
on public.analytics_events for insert
to public with check (true);

create policy "Admins can read events"
on public.analytics_events for select
to public using (public.has_role(auth.uid(), 'admin'));

-- chat_logs
create table public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index idx_chat_logs_session on public.chat_logs(session_id, created_at);
create index idx_chat_logs_created_at on public.chat_logs(created_at desc);

alter table public.chat_logs enable row level security;

create policy "Anyone can insert chat logs"
on public.chat_logs for insert
to public with check (true);

create policy "Admins can read chat logs"
on public.chat_logs for select
to public using (public.has_role(auth.uid(), 'admin'));