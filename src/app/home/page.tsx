import Link from "next/link";
import Image from "next/image";
import { getLeaderboard } from "@/actions/leaderboard";
import { getCurrentProfile, getRecentlyPlayed } from "@/actions/home";
import { getMysteriesByTheme } from "@/actions/mysteries";

const THEMES = [
  { label: "Games of the Week", slug: undefined },
  { label: "Horror", slug: "horror" },
  { label: "Mystery", slug: "mystery" },
  { label: "Sports", slug: "sports" },
  { label: "Sci-Fi", slug: "scifi" },
  { label: "Medieval", slug: "medieval" },
];

export default async function HomePage() {
  const [profile, leaderboard, recentlyPlayed, mysteriesByTheme] = await Promise.all([
    getCurrentProfile(),
    getLeaderboard(10),
    getRecentlyPlayed(5),
    Promise.all(THEMES.map((t) => getMysteriesByTheme(t.slug ?? undefined))),
  ]);

  const nickname = profile?.nickname ?? "Detective";

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-2xl font-bold text-white mb-8">
          Welcome back, {nickname}
        </h1>

        {/* Hero: Games of the Week + Leaderboard */}
        <section className="grid gap-8 lg:grid-cols-3 mb-12">
          <div className="lg:col-span-2 rounded-xl border border-mystery-border bg-mystery-card p-6">
            <h2 className="font-display text-lg font-semibold text-mystery-accent mb-4">
              Games of the Week
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {mysteriesByTheme[0]?.length > 0 ? (
                mysteriesByTheme[0].map((m) => (
                  <Link
                    key={m.slug}
                    href={`/game/${m.slug}`}
                    className="flex-shrink-0 w-48 rounded-lg border border-mystery-border bg-mystery-dark p-4 hover:border-mystery-accent transition"
                  >
                    <div className="aspect-video rounded bg-mystery-border mb-3 overflow-hidden relative">
                      <Image src="/images/mysteries/stolen-painting/stolen-painting-cover.png" alt={m.title_en} fill className="object-cover" />
                    </div>
                    <p className="font-medium text-white">{m.title_en}</p>
                    <p className="text-xs text-mystery-accent mt-1 capitalize">{m.theme}</p>
                  </Link>
                ))
              ) : (
                <Link
                  href="/game/stolen-painting"
                  className="flex-shrink-0 w-48 rounded-lg border border-mystery-border bg-mystery-dark p-4 hover:border-mystery-accent transition"
                >
                  <div className="aspect-video rounded bg-mystery-border mb-3 overflow-hidden relative">
                    <Image src="/images/mysteries/stolen-painting/stolen-painting-cover.png" alt="The Stolen Painting" fill className="object-cover" />
                  </div>
                  <p className="font-medium text-white">The Stolen Painting</p>
                  <p className="text-xs text-mystery-accent mt-1">Play now</p>
                </Link>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-mystery-border bg-mystery-card p-6">
            <h2 className="font-display text-lg font-semibold text-mystery-accent mb-4">
              Global Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 5).map((entry, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-mystery-accent font-medium w-6">#{i + 1}</span>
                    <span className="text-white">{entry.nickname}</span>
                    <span className="text-neutral-500 text-sm ml-auto">{entry.total_xp} XP</span>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-sm">No players yet. Be the first!</p>
              )}
            </div>
            <Link
              href="/leaderboard"
              className="mt-4 inline-block text-sm text-mystery-accent hover:underline"
            >
              View Full Leaderboard →
            </Link>
          </div>
        </section>

        {/* Recently played */}
        <section className="mb-12">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Recently Played
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentlyPlayed.length > 0 ? (
              recentlyPlayed.map((r) => (
                <Link
                  key={r.mystery_slug}
                  href={`/game/${r.mystery_slug}`}
                  className="flex-shrink-0 w-40 rounded-lg border border-mystery-border bg-mystery-card p-4 hover:border-mystery-accent transition overflow-hidden"
                >
                  <div className="aspect-video rounded bg-mystery-border mb-3 relative overflow-hidden">
                    <Image src="/images/mysteries/stolen-painting/stolen-painting-cover.png" alt={r.mystery_title} fill className="object-cover" />
                  </div>
                  <p className="font-medium text-white text-sm">{r.mystery_title}</p>
                  <span className="text-xs text-mystery-accent">
                    {r.status === "completed" ? "Completed" : "Resume"}
                  </span>
                </Link>
              ))
            ) : (
              <Link
                href="/game/stolen-painting"
                className="flex-shrink-0 w-40 rounded-lg border border-mystery-border bg-mystery-card p-4 hover:border-mystery-accent transition overflow-hidden"
              >
                <div className="aspect-video rounded bg-mystery-border mb-3 relative overflow-hidden">
                  <Image src="/images/mysteries/stolen-painting/stolen-painting-cover.png" alt="The Stolen Painting" fill className="object-cover" />
                </div>
                <p className="font-medium text-white text-sm">The Stolen Painting</p>
                <span className="text-xs text-mystery-accent">Start playing</span>
              </Link>
            )}
          </div>
        </section>

        {/* Thematic carousels (Netflix-style) */}
        {THEMES.slice(1).map((theme, idx) => {
          const mysteries = mysteriesByTheme[idx + 1] ?? [];
          if (mysteries.length === 0) return null;
          return (
            <section key={theme.slug} className="mb-12">
              <h2 className="font-display text-lg font-semibold text-white mb-4">
                {theme.label}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mysteries.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/game/${m.slug}`}
                    className="flex-shrink-0 w-48 rounded-lg border border-mystery-border bg-mystery-card overflow-hidden hover:border-mystery-accent transition"
                  >
                    <div className="aspect-video bg-mystery-dark relative overflow-hidden">
                      <Image src="/images/mysteries/stolen-painting/stolen-painting-cover.png" alt={m.title_en} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-white">{m.title_en}</p>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {m.teaser_en ?? ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Placeholder carousels when no DB mysteries per theme */}
        <section className="mb-12">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            More to explore
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Horror", slug: "horror", path: "/images/themes/horror.png" },
              { label: "Sports", slug: "sports", path: "/images/themes/Sci-Fi.png" },
              { label: "Sci-Fi", slug: "scifi", path: "/images/themes/Sci-Fi.png" },
              { label: "Medieval", slug: "medieval", path: "/images/themes/Medieval.png" },
            ].map(({ label, slug, path }) => (
              <Link
                key={slug}
                href={`/mysteries?theme=${slug}`}
                className="rounded-xl border border-mystery-border bg-mystery-card overflow-hidden hover:border-mystery-accent transition group"
              >
                <div className="aspect-video relative">
                  <Image src={path} alt={label} fill className="object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-4 text-center">
                  <p className="font-display text-xl font-semibold text-white">{label}</p>
                  <p className="text-sm text-neutral-500 mt-1">Coming soon</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
