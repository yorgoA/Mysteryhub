-- Allow leaderboard to read all profiles (nickname, avatar, total_xp, rank)
create policy "Leaderboard: profiles are readable by all"
  on public.profiles for select using (true);
