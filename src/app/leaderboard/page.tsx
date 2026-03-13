import Link from "next/link";
import { getLeaderboard } from "@/actions/leaderboard";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(50);

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/home"
          className="text-sm text-mystery-accent hover:underline mb-6 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          Leaderboard
        </h1>

        <div className="rounded-xl border border-mystery-border bg-mystery-card overflow-hidden">
          {leaderboard.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-mystery-border text-left text-sm text-neutral-400">
                  <th className="p-4 font-medium">Rank</th>
                  <th className="p-4 font-medium">Player</th>
                  <th className="p-4 font-medium text-right">XP</th>
                  <th className="p-4 font-medium text-right">Rank</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-b border-mystery-border last:border-0 hover:bg-mystery-dark/50"
                  >
                    <td className="p-4 text-mystery-accent font-medium">#{i + 1}</td>
                    <td className="p-4 text-white">{entry.nickname}</td>
                    <td className="p-4 text-right text-neutral-300">{entry.total_xp}</td>
                    <td className="p-4 text-right text-neutral-400 text-sm">
                      {entry.rank ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-8 text-center text-neutral-500">
              No players yet. Complete a mystery to appear on the leaderboard!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
