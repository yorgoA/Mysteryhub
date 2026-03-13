"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { stolenPainting } from "@/data/mysteries/stolen-painting";
import { IMAGES } from "@/lib/images";
import { saveMysteryCompletion } from "@/actions/progress";
import type { Room } from "@/data/mysteries/stolen-painting";
import type { RoomItem } from "@/data/mysteries/stolen-painting";

const GameRoom3DCanvas = dynamic(() => import("./GameRoom3DCanvas"), {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video rounded-lg bg-mystery-dark/80 flex items-center justify-center">
        <p className="text-mystery-accent">Loading 3D room...</p>
      </div>
    ),
  }
);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function checkCode(given: string, expected: string, normalizedExpected?: string): boolean {
  const g = normalize(given);
  const e = normalizedExpected ? normalize(normalizedExpected) : normalize(expected);
  if (!g || g.length < 2) return false;
  if (g === e) return true;
  if (g.includes(e)) return true;
  if (g.length >= 3 && e.includes(g)) return true;
  return false;
}

const ROOM_IMAGES: Record<number, string> = {
  1: IMAGES.mysteries["stolen-painting"].rooms[1],
  2: IMAGES.mysteries["stolen-painting"].rooms[2],
  3: IMAGES.mysteries["stolen-painting"].rooms[3],
};

export function GameSession3D({
  mysterySlug,
  leaderboard,
}: {
  mysterySlug: string;
  leaderboard?: React.ReactNode;
}) {
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const mystery = mysterySlug === "stolen-painting" ? stolenPainting : null;

  useEffect(() => {
    const onLockChange = () => setIsPointerLocked(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onLockChange);
    return () => document.removeEventListener("pointerlockchange", onLockChange);
  }, []);
  const [currentRoom, setCurrentRoom] = useState(-1);
  const [solvedLocks, setSolvedLocks] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<RoomItem | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  useEffect(() => {
    if (!completed || !mystery || saved) return;
    const solveTime = Math.round((Date.now() - startTime) / 1000);
    saveMysteryCompletion(mystery.slug, solveTime, hintsUsed, mystery.badgeSlug).then(
      (r) => {
        if (r.error) setSaveError(r.error);
        else {
          setSaved(true);
          if ("xpEarned" in r && typeof r.xpEarned === "number")
            setXpEarned(r.xpEarned);
        }
      }
    );
  }, [completed, mystery, saved, startTime, hintsUsed]);

  if (!mystery) {
    return (
      <main className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-white">Mystery not found</h1>
          <Link
            href="/mysteries"
            className="text-mystery-accent mt-4 inline-block hover:underline"
          >
            Back to Mysteries
          </Link>
        </div>
      </main>
    );
  }

  const room = currentRoom >= 0 ? (mystery.rooms[currentRoom] as Room) : undefined;
  const isIntro = currentRoom === -1;
  const totalRooms = mystery.rooms.length;

  const handleCodeSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedItem?.lock || !room) return;
      const lock = selectedItem.lock;
      const correct = checkCode(codeInput.trim(), lock.answer, lock.normalizedAnswer);
      if (correct) {
        setFeedback("correct");
        const newSolved = new Set(
          Array.from(solvedLocks).concat(selectedItem.id)
        );
        setSolvedLocks(newSolved);
        setTimeout(() => {
          setSelectedItem(null);
          setCodeInput("");
          setFeedback(null);
          if (newSolved.size >= room.locksRequired) {
            if (currentRoom + 1 >= totalRooms) {
              setCompleted(true);
            } else {
              setCurrentRoom((r) => r + 1);
              setSolvedLocks(new Set());
            }
          }
        }, 1200);
      } else {
        setFeedback("wrong");
        setTimeout(() => setFeedback(null), 1500);
      }
    },
    [selectedItem, codeInput, solvedLocks, room, currentRoom, totalRooms]
  );

  const handleStart = useCallback(() => {
    setCurrentRoom(0);
    setSolvedLocks(new Set());
    setSelectedItem(null);
  }, []);

  if (isIntro) {
    return (
      <main className="min-h-screen pb-16 px-4 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-1 max-w-3xl">
          <div className="rounded-xl border border-mystery-border bg-mystery-card p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 relative aspect-square">
                <Image
                  src={IMAGES.characters["sherlock-holmes"]}
                  alt={mystery.gmName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-mystery-accent">{mystery.gmName}</p>
                <p className="text-neutral-400">Game Master</p>
              </div>
            </div>
            <p className="text-white leading-relaxed whitespace-pre-line">
              {mystery.intro}
            </p>
            <p className="mt-4 text-sm text-mystery-accent">
              🎮 3D Mode — Explore the room, click items to inspect and solve codes
            </p>
            <button
              onClick={handleStart}
              className="mt-8 rounded-lg bg-mystery-accent px-6 py-3 font-medium text-mystery-dark hover:bg-mystery-accentDim transition"
            >
              Begin Investigation
            </button>
          </div>
        </div>
        {leaderboard}
      </main>
    );
  }

  if (completed) {
    const solveTime = Math.round((Date.now() - startTime) / 1000);
    const displayedXp = xpEarned ?? (saved ? "—" : "...");
    return (
      <main className="min-h-screen pb-16 px-4 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-1 max-w-2xl mx-auto text-center">
          <div className="rounded-xl border border-mystery-accent bg-mystery-card p-12">
            <h1 className="font-display text-3xl font-bold text-mystery-accent">
              Case Closed
            </h1>
            <p className="mt-4 text-white">{mystery.completionMessage}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left sm:text-center">
              <div>
                <p className="text-sm text-neutral-500">Solve time</p>
                <p className="text-white font-medium">
                  {Math.floor(solveTime / 60)}m {solveTime % 60}s
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Hints used</p>
                <p className="text-white font-medium">{hintsUsed}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">XP earned</p>
                <p className="text-mystery-accent font-medium">+{displayedXp}</p>
              </div>
            </div>
            {saveError && (
              <p className="mt-4 text-sm text-red-400">
                Could not save: {saveError}
              </p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/home"
                className="rounded-lg bg-mystery-accent px-6 py-3 font-medium text-mystery-dark"
              >
                Back to Home
              </Link>
              <Link
                href="/mysteries"
                className="rounded-lg border border-mystery-border px-6 py-3 font-medium text-white"
              >
                More Mysteries
              </Link>
            </div>
          </div>
        </div>
        {leaderboard}
      </main>
    );
  }

  if (!room) return null;

  const locksSolved = room.items.filter(
    (i) => i.lock && solvedLocks.has(i.id)
  ).length;
  const canProceed = locksSolved >= room.locksRequired;
  const roomImageUrl = ROOM_IMAGES[room.id] ?? IMAGES.mysteries["stolen-painting"].cover;

  return (
    <main className="fixed inset-0 top-[5rem] flex flex-col bg-mystery-dark">
      {/* Full-screen 3D canvas */}
      <div className="flex-1 min-h-0 w-full relative">
        {!isPointerLocked && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-mystery-dark/70 backdrop-blur-[2px] pointer-events-none"
            aria-hidden
          >
            <div className="text-center px-6 py-4 rounded-xl bg-mystery-card/90 border border-mystery-border">
              <p className="text-mystery-accent font-medium">Click to explore</p>
              <p className="text-sm text-neutral-400 mt-1">WASD to walk • Click items to inspect • Esc to exit</p>
            </div>
          </div>
        )}
        <GameRoom3DCanvas
          room={room}
          roomImageUrl={roomImageUrl}
          solvedLocks={solvedLocks}
          selectedItem={selectedItem}
          onSelectItem={(item) => {
            setSelectedItem(item);
            setCodeInput("");
            setFeedback(null);
            setHintRevealed(false);
          }}
        />
        {/* Room title overlay */}
        <div className="absolute top-3 left-4 right-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-mystery-accent">
              Room {room.id} — {room.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Locks: {locksSolved}/{room.locksRequired} • WASD walk • Click items
            </p>
          </div>
          {leaderboard && (
            <div className="hidden lg:block w-64 flex-shrink-0">{leaderboard}</div>
          )}
        </div>
      </div>

      {/* Bottom dialog panel */}
      <div className="flex-shrink-0 border-t border-mystery-border bg-mystery-card/95 backdrop-blur px-4 py-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 relative aspect-square">
              <Image
                src={IMAGES.characters["sherlock-holmes"]}
                alt={mystery.gmName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-white text-sm">{mystery.gmName}</p>
              <p className="text-xs text-neutral-500">Game Master</p>
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full sm:max-w-xl">
            {selectedItem ? (
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <p className="text-white font-medium text-sm">{selectedItem.name}</p>
                  <p className="text-xs text-neutral-400">{selectedItem.description}</p>
                </div>
                {selectedItem.lock ? (
                  <form onSubmit={handleCodeSubmit} className="flex flex-wrap gap-2 items-end flex-1">
                    <div>
                      <p className="text-xs text-mystery-accent mb-1">{selectedItem.lock.prompt}</p>
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        placeholder="Enter code..."
                        disabled={!!feedback}
                        className="rounded-lg border border-mystery-border bg-mystery-dark px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-mystery-accent focus:outline-none w-40"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!!feedback}
                      className="rounded-lg bg-mystery-accent px-4 py-2 text-sm font-medium text-mystery-dark disabled:opacity-50"
                    >
                      Submit
                    </button>
                    {selectedItem.lock.hint && (
                      hintRevealed ? (
                        <p className="text-xs text-mystery-accent">💡 {selectedItem.lock.hint}</p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setHintsUsed((p) => p + 1); setHintRevealed(true); }}
                          className="text-xs text-neutral-500 hover:text-mystery-accent"
                        >
                          💡 Hint
                        </button>
                      )
                    )}
                    {feedback === "correct" && <span className="text-green-400 text-sm">✓</span>}
                    {feedback === "wrong" && <span className="text-amber-400 text-sm">Try again</span>}
                  </form>
                ) : (
                  <p className="text-neutral-500 text-sm">No lock.</p>
                )}
                <button
                  type="button"
                  onClick={() => { setSelectedItem(null); setCodeInput(""); setFeedback(null); setHintRevealed(false); }}
                  className="text-xs text-neutral-500 hover:text-white"
                >
                  ← Back
                </button>
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">
                Click an item in the room to inspect it. {room.gmIntro}
              </p>
            )}
          </div>

          {canProceed && (
            <button
              onClick={() => {
                setCurrentRoom((r) => r + 1);
                setSolvedLocks(new Set());
                setSelectedItem(null);
              }}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 flex-shrink-0"
            >
              Next room →
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-neutral-500">
          Room {room.id} of {totalRooms}
        </p>
      </div>
    </main>
  );
}
