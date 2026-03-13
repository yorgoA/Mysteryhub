"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MysteryCard = {
  slug: string;
  title_en: string;
  teaser_en: string | null;
  theme: string;
  difficulty: string;
};

export async function getMysteriesByTheme(theme?: string): Promise<MysteryCard[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from("mysteries")
    .select("slug, title_en, teaser_en, theme, difficulty")
    .order("created_at", { ascending: false });

  if (theme) {
    query = query.eq("theme", theme);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getAllMysteriesGroupedByTheme(): Promise<Record<string, MysteryCard[]>> {
  const all = await getMysteriesByTheme();
  const byTheme: Record<string, MysteryCard[]> = {};
  for (const m of all) {
    const t = m.theme ?? "mystery";
    if (!byTheme[t]) byTheme[t] = [];
    byTheme[t].push(m);
  }
  return byTheme;
}
