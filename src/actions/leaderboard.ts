"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type LeaderboardEntry = {
  nickname: string;
  avatar: string | null;
  total_xp: number;
  rank: string | null;
};

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("profiles")
    .select("nickname, avatar, total_xp, rank")
    .order("total_xp", { ascending: false })
    .limit(limit);

  return data ?? [];
}
