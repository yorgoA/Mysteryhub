"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/home";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local");
      setLoading(false);
      return;
    }

    try {
      if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname: nickname || undefined },
          },
        });
        if (signUpError) throw signUpError;
        if (data?.user && !data.session) {
          setError("Check your email to confirm your account.");
          setLoading(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "sign-up" && (
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-neutral-300 mb-1">
            Nickname
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Detective42"
            className="w-full rounded-lg border border-mystery-border bg-mystery-card px-4 py-2 text-white placeholder-neutral-500 focus:border-mystery-accent focus:outline-none focus:ring-1 focus:ring-mystery-accent"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-mystery-border bg-mystery-card px-4 py-2 text-white placeholder-neutral-500 focus:border-mystery-accent focus:outline-none focus:ring-1 focus:ring-mystery-accent"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="••••••••"
          className="w-full rounded-lg border border-mystery-border bg-mystery-card px-4 py-2 text-white placeholder-neutral-500 focus:border-mystery-accent focus:outline-none focus:ring-1 focus:ring-mystery-accent"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-mystery-accent py-3 font-medium text-mystery-dark transition hover:bg-mystery-accentDim disabled:opacity-50"
      >
        {loading ? "..." : mode === "sign-in" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}
