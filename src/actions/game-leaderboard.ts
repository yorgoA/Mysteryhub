"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type GameLeaderboardEntry = {
  nickname: string;
  solve_time_seconds: number;
  rank: number;
};

export async function getGameLeaderboard(
  mysterySlug: string,
  limit = 10
): Promise<{ entries: GameLeaderboardEntry[]; title: string }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { entries: [], title: "" };

  const { data: mystery } = await supabase
    .from("mysteries")
    .select("id, title_en")
    .eq("slug", mysterySlug)
    .single();

  if (!mystery) return { entries: [], title: "" };

  const { data } = await supabase
    .from("player_progress")
    .select("solve_time_seconds, profiles(nickname)")
    .eq("mystery_id", mystery.id)
    .eq("status", "completed")
    .order("solve_time_seconds", { ascending: true })
    .limit(limit);

  const entries: GameLeaderboardEntry[] = (data ?? [])
    .filter((r) => r.profiles)
    .map((r, i) => {
      const raw = r.profiles as unknown;
      const p = Array.isArray(raw) ? raw[0] : raw;
      const prof = p as { nickname: string } | null;
      return {
        nickname: prof?.nickname ?? "Anonymous",
        solve_time_seconds: r.solve_time_seconds ?? 0,
        rank: i + 1,
      };
    });

  return { entries, title: mystery.title_en };
}
