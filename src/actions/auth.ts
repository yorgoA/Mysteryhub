"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_USERS = 10;

export async function checkSignUpAllowed(): Promise<{ allowed: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { allowed: true };
  }

  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    return { allowed: true };
  }

  if (count !== null && count >= MAX_USERS) {
    return {
      allowed: false,
      error: "Registration is closed. Maximum number of users reached.",
    };
  }

  return { allowed: true };
}
