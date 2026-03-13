import { getGameLeaderboard } from "@/actions/game-leaderboard";
import { GameLayout } from "./GameLayout";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default async function GamePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { entries, title } = await getGameLeaderboard(slug, 10);

  return (
    <GameLayout
      mysterySlug={slug}
      leaderboard={
        <aside className="lg:w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-24 rounded-xl border border-mystery-border bg-mystery-card p-6">
            <h3 className="font-display text-lg font-semibold text-mystery-accent mb-4">
              {title} — Leaderboard
            </h3>
            {entries.length > 0 ? (
              <div className="space-y-2">
                {entries.map((e) => (
                  <div
                    key={e.rank}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-mystery-accent font-medium">#{e.rank}</span>
                    <span className="text-white truncate flex-1 mx-2">{e.nickname}</span>
                    <span className="text-neutral-500">{formatTime(e.solve_time_seconds)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">No completions yet. Be the first!</p>
            )}
          </div>
        </aside>
      }
    />
  );
}
