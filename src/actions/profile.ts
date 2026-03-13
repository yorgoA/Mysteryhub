"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileBadge = { slug: string; name_en: string };
export type BestGame = { slug: string; title: string; theme: string; solve_time_seconds: number };

export async function getProfileData() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar, total_xp, rank")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  const { data: badgesData } = await supabase
    .from("player_badges")
    .select("badges(slug, name_en)")
    .eq("profile_id", user.id);

  const badges: ProfileBadge[] = (badgesData ?? [])
    .filter((b) => b.badges)
    .map((b) => {
      const raw = b.badges as unknown;
      const obj = Array.isArray(raw) ? raw[0] : raw;
      return obj as ProfileBadge;
    })
    .filter((b) => b?.slug);

  const { data: completedData } = await supabase
    .from("player_progress")
    .select("solve_time_seconds, mysteries(slug, title_en, theme)")
    .eq("profile_id", user.id)
    .eq("status", "completed")
    .order("solve_time_seconds", { ascending: true });

  const bestGames: BestGame[] = (completedData ?? [])
    .filter((r) => r.mysteries)
    .map((r) => {
      const raw = r.mysteries as unknown;
      const m = Array.isArray(raw) ? raw[0] : raw;
      const obj = m as { slug: string; title_en: string; theme: string } | null;
      if (!obj) return null;
      return {
        slug: obj.slug,
        title: obj.title_en,
        theme: obj.theme ?? "mystery",
        solve_time_seconds: r.solve_time_seconds ?? 0,
      };
    })
    .filter((x): x is BestGame => x !== null);

  const themes = Array.from(new Set(bestGames.map((g) => g.theme))).filter(Boolean);

  return {
    nickname: profile.nickname,
    avatar: profile.avatar,
    total_xp: profile.total_xp ?? 0,
    rank: profile.rank ?? "Rookie",
    badges,
    bestGames,
    themes,
  };
}
