"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { stolenPainting } from "@/data/mysteries/stolen-painting";
import { IMAGES } from "@/lib/images";
import { saveMysteryCompletion } from "@/actions/progress";

type Room = (typeof stolenPainting.rooms)[0];
type RoomItem = Room["items"][0];

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

export function GameSession({ mysterySlug }: { mysterySlug: string }) {
  const mystery = mysterySlug === "stolen-painting" ? stolenPainting : null;
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
    saveMysteryCompletion(
      mystery.slug,
      solveTime,
      hintsUsed,
      mystery.badgeSlug
    ).then((r) => {
      if (r.error) setSaveError(r.error);
      else {
        setSaved(true);
        if ("xpEarned" in r && typeof r.xpEarned === "number") setXpEarned(r.xpEarned);
      }
    });
  }, [completed, mystery, saved, startTime, hintsUsed]);

  if (!mystery) {
    return (
      <main className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-white">Mystery not found</h1>
          <Link href="/mysteries" className="text-mystery-accent mt-4 inline-block hover:underline">
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
        const newSolved = new Set(Array.from(solvedLocks).concat(selectedItem.id));
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
      <main className="min-h-screen pt-20 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
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
            <p className="text-white leading-relaxed whitespace-pre-line">{mystery.intro}</p>
            <button
              onClick={handleStart}
              className="mt-8 rounded-lg bg-mystery-accent px-6 py-3 font-medium text-mystery-dark hover:bg-mystery-accentDim transition"
            >
              Begin Investigation
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (completed) {
    const solveTime = Math.round((Date.now() - startTime) / 1000);
    const displayedXp = xpEarned ?? (saved ? "—" : "...");
    return (
      <main className="min-h-screen pt-20 pb-16 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-xl border border-mystery-accent bg-mystery-card p-12">
            <h1 className="font-display text-3xl font-bold text-mystery-accent">Case Closed</h1>
            <p className="mt-4 text-white">{mystery.completionMessage}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left sm:text-center">
              <div>
                <p className="text-sm text-neutral-500">Solve time</p>
                <p className="text-white font-medium">{Math.floor(solveTime / 60)}m {solveTime % 60}s</p>
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
              <p className="mt-4 text-sm text-red-400">Could not save: {saveError}</p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/home" className="rounded-lg bg-mystery-accent px-6 py-3 font-medium text-mystery-dark">
                Back to Home
              </Link>
              <Link href="/mysteries" className="rounded-lg border border-mystery-border px-6 py-3 font-medium text-white">
                More Mysteries
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!room) return null;

  const locksSolved = room.items.filter((i) => i.lock && solvedLocks.has(i.id)).length;
  const canProceed = locksSolved >= room.locksRequired;

  return (
    <main className="min-h-screen pt-20 pb-32 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Room + items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-mystery-border bg-mystery-card p-6 overflow-hidden">
              <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
                <Image
                  src={IMAGES.mysteries["stolen-painting"].rooms[room.id as 1 | 2 | 3] ?? IMAGES.mysteries["stolen-painting"].cover}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="font-display text-lg font-semibold text-mystery-accent mb-2">
                Room {room.id} — {room.title}
              </h2>
              <p className="text-neutral-400 text-sm mb-4">{room.gmIntro}</p>
              <p className="text-xs text-mystery-accent mb-4">
                Locks solved: {locksSolved} / {room.locksRequired}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.items.map((item) => {
                  const hasLock = !!item.lock;
                  const isSolved = hasLock && solvedLocks.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isSolved) return;
                        setSelectedItem(item);
                        setCodeInput("");
                        setFeedback(null);
                        setHintRevealed(false);
                      }}
                      disabled={isSolved}
                      className={`rounded-lg border p-3 text-left transition ${
                        isSolved
                          ? "border-green-500/50 bg-green-500/10 cursor-default"
                          : hasLock
                            ? "border-mystery-accent/50 hover:border-mystery-accent hover:bg-mystery-accent/10"
                            : "border-mystery-border hover:border-mystery-border/80"
                      }`}
                    >
                      <span className="text-sm font-medium text-white block truncate">{item.name}</span>
                      {isSolved && <span className="text-xs text-green-400">✓ Solved</span>}
                      {hasLock && !isSolved && <span className="text-xs text-mystery-accent">🔒</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* GM + code input */}
          <div className="space-y-6">
            <div className="rounded-xl border border-mystery-border bg-mystery-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 relative aspect-square">
                  <Image src={IMAGES.characters["sherlock-holmes"]} alt={mystery.gmName} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-white">{mystery.gmName}</p>
                  <p className="text-xs text-neutral-500">Game Master</p>
                </div>
              </div>

              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium">{selectedItem.name}</p>
                    <p className="text-sm text-neutral-400 mt-1">{selectedItem.description}</p>
                  </div>
                  {selectedItem.lock ? (
                    <form onSubmit={handleCodeSubmit} className="space-y-2">
                      <p className="text-sm text-mystery-accent">{selectedItem.lock.prompt}</p>
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        placeholder="Enter code..."
                        disabled={!!feedback}
                        className="w-full rounded-lg border border-mystery-border bg-mystery-dark px-4 py-3 text-white placeholder-neutral-500 focus:border-mystery-accent focus:outline-none"
                      />
                      {selectedItem.lock.hint && (
                        <div>
                          {hintRevealed ? (
                            <p className="text-sm text-mystery-accent">💡 {selectedItem.lock.hint}</p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setHintsUsed((p) => p + 1); setHintRevealed(true); }}
                              className="text-xs text-neutral-500 hover:text-mystery-accent"
                            >
                              💡 Use hint (-10% XP)
                            </button>
                          )}
                        </div>
                      )}
                      {feedback === "correct" && <p className="text-green-400 text-sm">Correct! ✓</p>}
                      {feedback === "wrong" && <p className="text-amber-400 text-sm">Wrong code. Try again.</p>}
                      <button
                        type="submit"
                        disabled={!!feedback}
                        className="w-full rounded-lg bg-mystery-accent py-3 font-medium text-mystery-dark disabled:opacity-50"
                      >
                        Submit Code
                      </button>
                    </form>
                  ) : (
                    <p className="text-neutral-500 text-sm">No lock on this item.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSelectedItem(null); setCodeInput(""); setFeedback(null); setHintRevealed(false); }}
                    className="text-xs text-neutral-500 hover:text-white"
                  >
                    ← Back to items
                  </button>
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">Click an item in the room to inspect it and enter codes.</p>
              )}
            </div>

            {canProceed && (
              <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-4">
                <p className="text-green-400 text-sm font-medium">All locks solved!</p>
                <button
                  onClick={() => {
                    setCurrentRoom((r) => r + 1);
                    setSolvedLocks(new Set());
                    setSelectedItem(null);
                  }}
                  className="mt-2 w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Proceed to next room →
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Room {room.id} of {totalRooms}
        </p>
      </div>
    </main>
  );
}
