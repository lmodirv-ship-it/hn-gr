
-- Roles enum
create type public.app_role as enum ('admin', 'client');

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Updated_at trigger function
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- Profiles policies
create policy "Profiles viewable by self or admin"
  on public.profiles for select
  using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins update any profile"
  on public.profiles for update
  using (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
create policy "Users view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + assign role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));

  if new.email = 'lmodirv@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'client');
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Project status enum
create type public.project_status as enum ('pending', 'in_review', 'active', 'completed', 'cancelled');

-- Project requests
create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  project_type text not null,
  budget text,
  timeline text,
  description text not null,
  status public.project_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.project_requests enable row level security;

create trigger update_project_requests_updated_at
before update on public.project_requests
for each row execute function public.update_updated_at_column();

-- project_requests policies
create policy "Anyone can submit a request"
  on public.project_requests for insert
  with check (true);

create policy "Users see own requests"
  on public.project_requests for select
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Admins update requests"
  on public.project_requests for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins delete requests"
  on public.project_requests for delete
  using (public.has_role(auth.uid(), 'admin'));
