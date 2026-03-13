"use client";

import { GameSession3D } from "@/components/GameSession3D";

export function GameLayout({
  mysterySlug,
  leaderboard,
}: {
  mysterySlug: string;
  leaderboard: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-20">
      <GameSession3D mysterySlug={mysterySlug} leaderboard={leaderboard} />
    </div>
  );
}
