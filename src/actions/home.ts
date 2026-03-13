"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Profile = {
  nickname: string;
  avatar: string | null;
  total_xp: number;
  rank: string | null;
};

export type RecentProgress = {
  mystery_slug: string;
  mystery_title: string;
  status: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("nickname, avatar, total_xp, rank")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getRecentlyPlayed(limit = 5): Promise<RecentProgress[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("player_progress")
    .select("status, mysteries(slug, title_en)")
    .eq("profile_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data
    .filter((r) => r.mysteries)
    .map((r) => {
      const raw = r.mysteries as unknown;
      const m = Array.isArray(raw) ? raw[0] : raw;
      const obj = m as { slug: string; title_en: string } | null;
      if (!obj) return null;
      return { mystery_slug: obj.slug, mystery_title: obj.title_en, status: r.status };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
