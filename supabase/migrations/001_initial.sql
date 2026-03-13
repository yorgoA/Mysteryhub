-- MysteriaHub initial schema
-- Run in Supabase SQL editor

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nickname text not null,
  avatar text default 'sherlock',
  total_xp int default 0,
  rank text default 'Rookie',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mysteries
create table public.mysteries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_fr text not null,
  teaser_en text,
  teaser_fr text,
  theme text, -- horror, medieval, scifi, etc.
  difficulty text default 'medium', -- easy, medium, hard
  cover_image_url text,
  xp_reward int default 100,
  created_at timestamptz default now()
);

-- Player progress (which mysteries they've started/completed)
create table public.player_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles on delete cascade not null,
  mystery_id uuid references public.mysteries on delete cascade not null,
  status text default 'in_progress', -- in_progress, completed
  current_room int default 1,
  completed_at timestamptz,
  solve_time_seconds int,
  xp_earned int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(profile_id, mystery_id)
);

-- Badges
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_fr text not null,
  description_en text,
  description_fr text,
  icon_url text,
  created_at timestamptz default now()
);

-- Player badges
create table public.player_badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles on delete cascade not null,
  badge_id uuid references public.badges on delete cascade not null,
  earned_at timestamptz default now(),
  unique(profile_id, badge_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.mysteries enable row level security;
alter table public.player_progress enable row level security;
alter table public.badges enable row level security;
alter table public.player_badges enable row level security;

-- Profiles: users can read/update own
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Mysteries: public read
create policy "Mysteries are viewable by everyone"
  on public.mysteries for select using (true);

-- Player progress: users can CRUD own
create policy "Users can manage own progress"
  on public.player_progress for all using (auth.uid() = profile_id);

-- Badges: public read
create policy "Badges are viewable by everyone"
  on public.badges for select using (true);

-- Player badges: users can read own
create policy "Users can read own badges"
  on public.player_badges for select using (auth.uid() = profile_id);
create policy "Service can insert player badges"
  on public.player_badges for insert with check (true);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', 'Player' || substr(new.id::text, 1, 6))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
