"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function getNav(isLoggedIn: boolean) {
  return [
    { href: isLoggedIn ? "/home" : "/", label: "Home" },
    { href: "/mysteries", label: "Mysteries" },
    { href: "/community", label: "Community" },
    ...(isLoggedIn ? [{ href: "/profile", label: "Profile" }] : []),
  ];
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-mystery-border bg-mystery-dark/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-mystery-accent"
        >
          MysteriaHub
        </Link>
        <div className="flex items-center gap-6">
          {getNav(!!user).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition hover:text-mystery-accent ${
                pathname === item.href ? "text-mystery-accent" : "text-neutral-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleSignOut}
                className="rounded border border-mystery-border px-4 py-2 text-sm text-neutral-300 transition hover:border-mystery-accent hover:text-mystery-accent"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="rounded bg-mystery-accent px-4 py-2 text-sm font-medium text-mystery-dark transition hover:bg-mystery-accentDim"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
