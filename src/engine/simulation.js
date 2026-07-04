// ---------------------------------------------------------------------------
// The traffic simulator — the "fake internet" this PoC runs on.
//
// A real QuestBoard would receive events from tracked links (clicks, verified
// Steam wishlists via UTM analytics, key redemptions). The PoC has no real
// traffic, so this module invents believable traffic instead, one simulated
// day at a time. Everything is driven by a *seeded* random generator, so the
// same demo plays out the same way on every reset — a repeatable movie.
// ---------------------------------------------------------------------------

import { GAMES, PROMOTERS } from "../data/seed.js";
import {
  payoutMultiplier,
  scoreGainForOutcomes,
  applyDailyDecay,
  SETTLEMENT_DAYS,
} from "./exposure.js";

// Small, well-known seeded random number generator (returns 0..1).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stochastic rounding: 0.4 becomes 1 forty percent of the time, 0 otherwise.
// Plain rounding would freeze small promoters at zero outcomes forever.
function roundStoch(x, rng) {
  const floor = Math.floor(x);
  return floor + (rng() < x - floor ? 1 : 0);
}

// How each promoter archetype behaves day to day.
const PATTERNS = {
  steady:  { activeChance: 0.85, volumeMult: 1.0 },
  weekend: { activeChance: 0.45, volumeMult: 1.6 },
  bursty:  { activeChance: 0.35, volumeMult: 2.4 },
  bot:     { activeChance: 0.95, volumeMult: 1.0 }, // special-cased below
};

// Fraud heuristic: a click spike far above the account's own recent average,
// combined with almost nobody converting, smells like purchased bot traffic.
const FRAUD_SPIKE_RATIO = 5;
const FRAUD_MIN_CONVERSION = 0.03;
const FRAUD_SCORE_PENALTY = 0.95; // flagged day: score docked 5%

export function claimQuest(state, promoterId, gameId) {
  const already = state.claims.some(
    (c) => c.promoterId === promoterId && c.gameId === gameId
  );
  if (already) return state;
  const id = state.nextIds.claim;
  const claim = {
    id,
    promoterId,
    gameId,
    dayClaimed: state.day,
    // The unique tracked link is how outcomes get attributed to a promoter.
    link: `questboard.gg/q/${gameId}?ref=${promoterId}&utm_campaign=qb${id}`,
    totals: { click: 0, wishlist: 0, demo: 0, key: 0 },
  };
  return {
    ...state,
    claims: [...state.claims, claim],
    nextIds: { ...state.nextIds, claim: id + 1 },
  };
}

// Advance the world by one day. Pure function: same input state -> same
// output state (the RNG is seeded from the day number).
export function simulateDay(prev) {
  const day = prev.day + 1;
  const rng = mulberry32(prev.rngSeed + day * 7919);

  // clone the parts we mutate
  const promoters = Object.fromEntries(
    Object.entries(prev.promoters).map(([id, p]) => [
      id,
      { ...p, scoreHistory: [...p.scoreHistory], recentClicks: [...(p.recentClicks ?? [])] },
    ])
  );
  const games = Object.fromEntries(
    Object.entries(prev.games).map(([id, g]) => [
      id,
      { ...g, totals: { ...g.totals }, dailyStats: [...g.dailyStats] },
    ])
  );
  const claims = prev.claims.map((c) => ({ ...c, totals: { ...c.totals } }));
  const ledger = [...prev.ledger];
  const fraudFlags = [...prev.fraudFlags];
  let ledgerId = prev.nextIds.ledger;

  const gameDayAgg = {}; // per-game {wishlists, spend} for chart history

  for (const p of Object.values(promoters)) {
    const myClaims = claims.filter((c) => c.promoterId === p.id);
    const pattern = PATTERNS[p.pattern] ?? PATTERNS.steady;
    // The demo's player always shows up; rivals follow their archetype.
    const active =
      myClaims.length > 0 && (p.isPlayer || rng() < pattern.activeChance);

    let dayCounts = { click: 0, wishlist: 0, demo: 0, key: 0 };
    const dayEntries = [];

    if (active) {
      const isBot = p.pattern === "bot";
      const botSpike = isBot && day % 5 === 0;

      for (const claim of myClaims) {
        const game = games[claim.gameId];
        const budgetLeft = game.budgetTotal - game.budgetSpent;
        if (budgetLeft <= 0.5) continue; // quest budget exhausted

        // Reach compounds with reputation: the score curve lifts audience too.
        const reach = p.reachBase * (0.4 + 0.4 * payoutMultiplier(p.score));
        const noise = 0.7 + rng() * 0.7;
        const impressions = reach * pattern.volumeMult * noise;

        let clicks = roundStoch(impressions * (0.06 + rng() * 0.05), rng);
        let wishlistRate = 0.22 * game.appeal * (0.8 + rng() * 0.4);
        if (botSpike) {
          clicks = Math.round(clicks * 10); // purchased click farm traffic
          wishlistRate = 0.004; // ...that converts to almost nothing
        }
        let wishlists = roundStoch(clicks * wishlistRate, rng);
        let demos = roundStoch(wishlists * (0.4 + rng() * 0.3), rng);
        const keysLeft = game.keysAvailable - game.keysUsed;
        let keys = Math.min(keysLeft, roundStoch(wishlists * 0.15 * (0.5 + rng()), rng));

        // Respect the dev's remaining budget: scale outcomes down if needed.
        const counts = { click: clicks, wishlist: wishlists, demo: demos, key: keys };
        let spend = 0;
        for (const [type, n] of Object.entries(counts))
          spend += n * game.bounties[type];
        if (spend > budgetLeft) {
          const f = budgetLeft / spend;
          for (const type of Object.keys(counts))
            counts[type] = Math.floor(counts[type] * f);
          spend = 0;
          for (const [type, n] of Object.entries(counts))
            spend += n * game.bounties[type];
        }

        // Record: dev spend, game totals, claim totals, promoter ledger.
        game.budgetSpent += spend;
        game.keysUsed += counts.key;
        gameDayAgg[game.id] ??= { wishlists: 0, spend: 0 };
        gameDayAgg[game.id].wishlists += counts.wishlist;
        gameDayAgg[game.id].spend += spend;

        const mult = payoutMultiplier(p.score);
        for (const [type, n] of Object.entries(counts)) {
          if (n === 0) continue;
          claim.totals[type] += n;
          game.totals[type] += n;
          dayCounts[type] += n;
          dayEntries.push({
            id: ledgerId++,
            day,
            claimId: claim.id,
            promoterId: p.id,
            gameId: game.id,
            type,
            count: n,
            devCost: n * game.bounties[type],
            gross: n * game.bounties[type] * mult,
            settlesOnDay: day + SETTLEMENT_DAYS,
            voided: false,
          });
        }
      }
    }

    // --- fraud check: spike vs own trailing average + terrible conversion ---
    const trailing = p.recentClicks;
    const avg = trailing.length
      ? trailing.reduce((a, b) => a + b, 0) / trailing.length
      : 0;
    const conversion = dayCounts.click > 0 ? dayCounts.wishlist / dayCounts.click : 1;
    const flagged =
      avg > 0 &&
      dayCounts.click > avg * FRAUD_SPIKE_RATIO &&
      conversion < FRAUD_MIN_CONVERSION;

    if (flagged) {
      // Money never moves: void the payouts, refund the dev's budget and
      // strip the fake outcomes back out of the public counts.
      for (const e of dayEntries) {
        e.voided = true;
        const game = games[e.gameId];
        game.budgetSpent -= e.devCost;
        game.totals[e.type] -= e.count;
        const claim = claims.find((c) => c.id === e.claimId);
        claim.totals[e.type] -= e.count;
        if (gameDayAgg[e.gameId]) {
          gameDayAgg[e.gameId].spend -= e.devCost;
          if (e.type === "wishlist") gameDayAgg[e.gameId].wishlists -= e.count;
        }
      }
      fraudFlags.push({
        day,
        promoterId: p.id,
        clicks: dayCounts.click,
        trailingAvg: Math.round(avg),
        conversion,
        detail: `${dayCounts.click} clicks (${(dayCounts.click / avg).toFixed(1)}× their average) but only ${(conversion * 100).toFixed(1)}% converted — traffic voided, payout withheld.`,
      });
      p.score = p.score * FRAUD_SCORE_PENALTY;
      p.streak = 0;
    } else {
      const hadOutcomes = Object.values(dayCounts).some((n) => n > 0);
      if (hadOutcomes) {
        p.streak += 1;
        p.score += scoreGainForOutcomes(dayCounts, p.streak);
      } else {
        p.streak = 0;
        p.score = applyDailyDecay(p.score);
      }
    }

    p.recentClicks = [...trailing, dayCounts.click].slice(-7);
    p.scoreHistory.push({ day, score: p.score });
    ledger.push(...dayEntries);
  }

  for (const g of Object.values(games)) {
    const agg = gameDayAgg[g.id] ?? { wishlists: 0, spend: 0 };
    g.dailyStats.push({ day, ...agg });
  }

  return {
    ...prev,
    day,
    promoters,
    games,
    claims,
    ledger,
    fraudFlags,
    nextIds: { ...prev.nextIds, ledger: ledgerId },
  };
}

export function buildInitialState() {
  const promoters = Object.fromEntries(
    PROMOTERS.map((p) => [
      p.id,
      {
        ...p,
        streak: 0,
        recentClicks: [],
        scoreHistory: [{ day: 0, score: p.score }],
      },
    ])
  );
  const games = Object.fromEntries(
    GAMES.map((g) => [
      g.id,
      {
        ...g,
        budgetSpent: 0,
        keysUsed: 0,
        totals: { click: 0, wishlist: 0, demo: 0, key: 0 },
        dailyStats: [],
      },
    ])
  );

  let state = {
    day: 0,
    rngSeed: 20260704,
    promoters,
    games,
    claims: [],
    ledger: [],
    fraudFlags: [],
    nextIds: { claim: 1, ledger: 1 },
  };

  // The rivals were already on the platform before you showed up.
  const rivalClaims = [
    ["priya", ["moonpetal", "deepseadiner", "bulletballet"]],
    ["carlos", ["moonpetal", "lighthouse"]],
    ["nina", ["gridrunner", "bulletballet"]],
    ["ben", ["lighthouse"]],
    ["sus99", ["gridrunner", "compostknights"]],
  ];
  for (const [promoterId, gameIds] of rivalClaims)
    for (const gameId of gameIds) state = claimQuest(state, promoterId, gameId);

  // Fast-forward two weeks so the demo opens on a living platform.
  for (let i = 0; i < 14; i++) state = simulateDay(state);
  return state;
}
