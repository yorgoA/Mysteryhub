"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateXP } from "@/lib/xp";

export async function saveMysteryCompletion(
  mysterySlug: string,
  solveTimeSeconds: number,
  hintsUsed: number,
  badgeSlug: string
) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: "Supabase not configured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: mystery } = await supabase
    .from("mysteries")
    .select("id, difficulty, target_time_seconds")
    .eq("slug", mysterySlug)
    .single();
  if (!mystery) return { error: "Mystery not found" };

  const { data: badge } = await supabase
    .from("badges")
    .select("id")
    .eq("slug", badgeSlug)
    .single();
  if (!badge) return { error: "Badge not found" };

  const { xp: xpEarned } = calculateXP(
    mystery.difficulty ?? "medium",
    solveTimeSeconds,
    hintsUsed,
    mystery.target_time_seconds ?? undefined
  );

  const { error: progressError } = await supabase.from("player_progress").upsert(
    {
      profile_id: user.id,
      mystery_id: mystery.id,
      status: "completed",
      current_room: 99,
      completed_at: new Date().toISOString(),
      solve_time_seconds: solveTimeSeconds,
      hints_used: hintsUsed,
      xp_earned: xpEarned,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id,mystery_id" }
  );
  if (progressError) return { error: progressError.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", user.id)
    .single();

  const newTotalXp = (profile?.total_xp ?? 0) + xpEarned;
  let newRank = "Rookie";
  if (newTotalXp >= 500) newRank = "Master";
  else if (newTotalXp >= 200) newRank = "Detective";
  else if (newTotalXp >= 50) newRank = "Apprentice";

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      total_xp: newTotalXp,
      rank: newRank,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  await supabase.from("player_badges").upsert(
    {
      profile_id: user.id,
      badge_id: badge.id,
    },
    { onConflict: "profile_id,badge_id", ignoreDuplicates: true }
  );

  return { ok: true, xpEarned };
}
