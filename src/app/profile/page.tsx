import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfileData } from "@/actions/profile";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default async function ProfilePage() {
  const data = await getProfileData();
  if (!data) redirect("/sign-in");

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/home"
          className="text-sm text-mystery-accent hover:underline mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="h-24 w-24 rounded-full bg-mystery-accent/20 flex items-center justify-center">
            <span className="font-display text-4xl text-mystery-accent">
              {data.nickname[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              {data.nickname}
            </h1>
            <p className="text-mystery-accent font-medium">{data.rank}</p>
            <p className="text-neutral-400 text-lg mt-1">{data.total_xp} XP</p>
          </div>
        </div>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            Badges
          </h2>
          {data.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {data.badges.map((b) => (
                <div
                  key={b.slug}
                  className="rounded-lg border border-mystery-accent bg-mystery-card px-4 py-2"
                >
                  <span className="text-mystery-accent">🏆</span>{" "}
                  <span className="text-white">{b.name_en}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No badges yet. Complete mysteries to earn some!</p>
          )}
        </section>

        {/* Best games */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            Best Games Played
          </h2>
          {data.bestGames.length > 0 ? (
            <div className="space-y-3">
              {data.bestGames.map((g) => (
                <Link
                  key={g.slug}
                  href={`/game/${g.slug}`}
                  className="flex items-center justify-between rounded-lg border border-mystery-border bg-mystery-card p-4 hover:border-mystery-accent transition"
                >
                  <div>
                    <p className="font-medium text-white">{g.title}</p>
                    <p className="text-sm text-neutral-500 capitalize">{g.theme}</p>
                  </div>
                  <span className="text-mystery-accent font-medium">
                    {formatTime(g.solve_time_seconds)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No completed mysteries yet. Start playing!</p>
          )}
        </section>

        {/* Themes I like */}
        <section>
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            Themes I Like
          </h2>
          {data.themes.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {data.themes.map((t) => (
                <Link
                  key={t}
                  href={`/mysteries?theme=${t}`}
                  className="rounded-lg border border-mystery-border bg-mystery-card px-4 py-2 capitalize hover:border-mystery-accent transition"
                >
                  {t}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">Complete mysteries to discover your favourite themes!</p>
          )}
        </section>
      </div>
    </main>
  );
}
