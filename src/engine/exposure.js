// ---------------------------------------------------------------------------
// The Exposure Score engine — the economic heart of QuestBoard.
//
// Design goals (see docs/commits/2_commit.md for the plain-language version):
//  1. Newcomers earn from day one (a low multiplier, never zero).
//  2. Earnings grow steeply with proven outcomes — the "exponential" feel.
//  3. Growth plateaus at a cap, so the top promoters can't eat the whole
//     market and mid-tier creators stay motivated.
//  4. Inactivity slowly decays the score — no squatting on early success.
//
// Goals 1–3 together describe a logistic (S-shaped) curve, not a pure
// exponential: flat start, steep middle, flat top.
// ---------------------------------------------------------------------------

// --- payout multiplier curve ---
// payout = bounty × multiplier(score)
export const MIN_MULT = 0.25; // a brand-new promoter earns 25% of the bounty
export const MAX_MULT = 3.0;  // the ceiling: 3× the bounty, however famous you get
export const CURVE_MIDPOINT = 400; // score where growth is steepest (mult = ~1.6)
export const CURVE_STEEPNESS = 0.012;

export function payoutMultiplier(score) {
  const s = Math.max(0, score);
  return (
    MIN_MULT +
    (MAX_MULT - MIN_MULT) /
      (1 + Math.exp(-CURVE_STEEPNESS * (s - CURVE_MIDPOINT)))
  );
}

// --- outcome events ---
// Score is earned from *verified outcomes*, never raw activity (posting a lot
// earns nothing; posts that convert do). Weights reflect how much each outcome
// is worth to a developer.
export const EVENT_TYPES = {
  click:    { label: "Link click",     scoreGain: 0.02, icon: "👆" },
  wishlist: { label: "Steam wishlist", scoreGain: 1.0,  icon: "⭐" },
  demo:     { label: "Demo download",  scoreGain: 0.5,  icon: "⬇️" },
  key:      { label: "Key redeemed",   scoreGain: 1.5,  icon: "🔑" },
};

// --- consistency streak ---
// Working every day compounds: each consecutive active day adds +15% to that
// day's score gains, capped at 3×. This produces the "more work grows your
// income exponentially (up to a level)" behaviour promoters actually feel.
export const STREAK_BONUS_PER_DAY = 0.15;
export const STREAK_BONUS_CAP = 3.0;

export function streakMultiplier(streakDays) {
  return Math.min(STREAK_BONUS_CAP, 1 + streakDays * STREAK_BONUS_PER_DAY);
}

// --- decay ---
// Every day with zero outcomes, the score shrinks slightly. ~0.6%/day means
// a month of silence costs roughly 17% of your score — noticeable, not brutal.
export const DAILY_DECAY = 0.006;

export function applyDailyDecay(score) {
  return score * (1 - DAILY_DECAY);
}

// --- settlement lag (anti-fraud) ---
// Earnings stay "pending" for 7 simulated days before they settle, giving the
// platform a window to void fraudulent outcomes before money moves.
export const SETTLEMENT_DAYS = 7;

// --- tiers ---
// Purely cosmetic labels over the continuous score, for the UI.
export const TIERS = [
  { name: "Newcomer",    min: 0,   color: "var(--text-dim)", icon: "🌱" },
  { name: "Rising",      min: 100, color: "var(--cyan)",     icon: "🚀" },
  { name: "Established", min: 300, color: "var(--green)",    icon: "⚡" },
  { name: "Partner",     min: 600, color: "var(--accent)",   icon: "💠" },
  { name: "Legend",      min: 900, color: "var(--amber)",    icon: "👑" },
];

export function tierFor(score) {
  let tier = TIERS[0];
  for (const t of TIERS) if (score >= t.min) tier = t;
  return tier;
}

export function nextTier(score) {
  return TIERS.find((t) => t.min > score) ?? null;
}

// --- daily gain soft cap ---
// Without a cap, a huge account would gain hundreds of points a day and blow
// past the curve in a week. tanh() keeps small gains almost untouched but
// compresses big days toward the cap — reputation must be earned over time.
export const DAILY_GAIN_CAP = 15;

// Total score gained for a day's worth of outcome counts, streak included.
export function scoreGainForOutcomes(counts, streakDays) {
  let base = 0;
  for (const [type, n] of Object.entries(counts)) {
    base += (EVENT_TYPES[type]?.scoreGain ?? 0) * n;
  }
  const raw = base * streakMultiplier(streakDays);
  return DAILY_GAIN_CAP * Math.tanh(raw / DAILY_GAIN_CAP);
}
