/**
 * XP calculation: base_xp × duration_multiplier × (1 - hint_penalty)
 */

const BASE_XP: Record<string, number> = {
  easy: 50,
  medium: 100,
  hard: 150,
};

const TARGET_TIME: Record<string, number> = {
  easy: 480,   // 8 min
  medium: 720, // 12 min
  hard: 1080,  // 18 min
};

const HINT_PENALTY_PER_HINT = 0.1; // 10% per hint

export function calculateXP(
  difficulty: string,
  solveTimeSeconds: number,
  hintsUsed: number,
  targetTimeSeconds?: number
): { xp: number; breakdown: { base: number; durationMult: number; hintPenalty: number } } {
  const diff = (difficulty || "medium").toLowerCase();
  const base = BASE_XP[diff] ?? 100;

  const target = targetTimeSeconds ?? TARGET_TIME[diff] ?? 720;
  const ratio = solveTimeSeconds / target;

  // Duration multiplier: 1.3 if under 80% of target, 1.0 at target, 0.6 if over 150%
  let durationMult = 1;
  if (ratio <= 0.8) durationMult = 1.3;
  else if (ratio <= 1) durationMult = 0.9 + 0.4 * (1 - (ratio - 0.8) / 0.2);
  else if (ratio <= 1.5) durationMult = 0.9 - 0.3 * ((ratio - 1) / 0.5);
  else durationMult = 0.6;

  const hintPenalty = Math.min(hintsUsed * HINT_PENALTY_PER_HINT, 0.5); // cap at 50%
  const xp = Math.round(base * durationMult * (1 - hintPenalty));
  const finalXp = Math.max(5, Math.min(xp, base * 1.5)); // floor 5, cap 1.5x base

  return {
    xp: finalXp,
    breakdown: { base, durationMult, hintPenalty },
  };
}
