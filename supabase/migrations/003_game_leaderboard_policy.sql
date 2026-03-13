-- Allow reading completed player_progress for per-game leaderboards
create policy "Anyone can read completed progress for leaderboards"
  on public.player_progress for select using (status = 'completed');
