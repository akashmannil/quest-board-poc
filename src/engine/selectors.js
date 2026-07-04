// Read-only helpers that answer questions about the world state.
// Money status is always *derived* from the ledger — never stored — so the
// pending/settled split can never drift out of sync with the day counter.

export function promoterLedger(state, promoterId) {
  return state.ledger.filter((e) => e.promoterId === promoterId);
}

export function earningsSummary(state, promoterId) {
  let pending = 0;
  let settled = 0;
  let voided = 0;
  for (const e of promoterLedger(state, promoterId)) {
    if (e.voided) voided += e.gross;
    else if (e.settlesOnDay <= state.day) settled += e.gross;
    else pending += e.gross;
  }
  return { pending, settled, voided, total: pending + settled };
}

// Gross earned per day over the last `lastN` days (zero-filled).
export function earningsByDay(state, promoterId, lastN = 30) {
  const start = Math.max(1, state.day - lastN + 1);
  const byDay = new Map();
  for (let d = start; d <= state.day; d++) byDay.set(d, 0);
  for (const e of promoterLedger(state, promoterId)) {
    if (!e.voided && e.day >= start) byDay.set(e.day, byDay.get(e.day) + e.gross);
  }
  return [...byDay.entries()].map(([day, gross]) => ({ x: day, y: gross }));
}

export function weeklyEarnings(state, promoterId) {
  return promoterLedger(state, promoterId)
    .filter((e) => !e.voided && e.day > state.day - 7)
    .reduce((a, e) => a + e.gross, 0);
}

export function claimEarnings(state, claimId) {
  return state.ledger
    .filter((e) => e.claimId === claimId && !e.voided)
    .reduce((a, e) => a + e.gross, 0);
}

// Recent non-voided ledger entries, newest first, for the activity table.
export function recentActivity(state, promoterId, limit = 10) {
  return promoterLedger(state, promoterId)
    .filter((e) => !e.voided)
    .slice(-limit)
    .reverse();
}
