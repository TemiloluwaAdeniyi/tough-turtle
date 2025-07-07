-- Enable Row Level Security
alter table if exists public.users enable row level security;
alter table if exists public.activities enable row level security;
alter table if exists public.challenges enable row level security;

-- Create users table
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  username text not null unique,
  xp integer default 0,
  stage text default 'Batchling Hatchling',
  skin text default 'default',
  skin_expiry timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create activities table
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null check (type in ('exercise', 'sleep', 'biohacking')),
  subtype text not null, -- e.g., 'cardio', 'strength', 'deep_sleep', 'cold_therapy'
  value numeric not null,
  unit text not null, -- e.g., 'minutes', 'hours', 'reps', 'kg'
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create challenges table
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('cardio', 'sleep', 'strength', 'hydration', 'meditation')),
  target numeric not null,
  progress numeric default 0,
  unit text not null,
  completed boolean default false,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for updated_at
drop trigger if exists on_users_updated on public.users;
create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_challenges_updated on public.challenges;
create trigger on_challenges_updated
  before update on public.challenges
  for each row execute procedure public.handle_updated_at();

-- Row Level Security Policies

-- Users can only see and edit their own profile
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Users can only see and manage their own activities
create policy "Users can view own activities" on public.activities
  for select using (auth.uid() = user_id);

create policy "Users can insert own activities" on public.activities
  for insert with check (auth.uid() = user_id);

create policy "Users can update own activities" on public.activities
  for update using (auth.uid() = user_id);

create policy "Users can delete own activities" on public.activities
  for delete using (auth.uid() = user_id);

-- Users can only see and manage their own challenges
create policy "Users can view own challenges" on public.challenges
  for select using (auth.uid() = user_id);

create policy "Users can insert own challenges" on public.challenges
  for insert with check (auth.uid() = user_id);

create policy "Users can update own challenges" on public.challenges
  for update using (auth.uid() = user_id);

create policy "Users can delete own challenges" on public.challenges
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_activities_user_id on public.activities(user_id);
create index if not exists idx_activities_type on public.activities(type);
create index if not exists idx_activities_created_at on public.activities(created_at);
create index if not exists idx_challenges_user_id on public.challenges(user_id);
create index if not exists idx_challenges_type on public.challenges(type);

-- Insert default challenges for new users
create or replace function public.create_default_challenges()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.challenges (user_id, name, type, target, unit) values
    (new.id, 'Deep Sleep Protocol', 'sleep', 8, 'hours'),
    (new.id, 'Power Lifting Circuit', 'strength', 5, 'sets'),
    (new.id, 'Zone 2 Endurance', 'cardio', 45, 'minutes'),
    (new.id, 'Optimal H2O Protocol', 'hydration', 3.5, 'liters'),
    (new.id, 'Mindfulness Flow', 'meditation', 20, 'minutes');
  return new;
end;
$$;

-- Create trigger to add default challenges
drop trigger if exists on_user_created on public.users;
create trigger on_user_created
  after insert on public.users
  for each row execute procedure public.create_default_challenges();