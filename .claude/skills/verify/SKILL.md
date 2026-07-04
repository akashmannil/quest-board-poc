# Verify: QuestBoard PoC (Vite SPA)

How to verify changes to this app end-to-end. No test suite — the surface is
the browser.

## Build & serve

```bash
npm run build
npx vite preview --port 4173 --strictPort   # run in background
```

(`npm run dev` on 5173 also works; preview serves the production build.)

## Drive it

No Playwright in this repo. Use `puppeteer-core` (install it in the session
scratchpad, not the project) against installed Chrome:

```js
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
```

There are no stable test ids; click by text via `document.querySelectorAll` +
`textContent.includes(...)`. Useful selectors: `.day-badge`, `.btn-primary`
(Advance day), `.btn-toggle` (Autoplay), `.btn-ghost` (Reset), `.nav button`,
`.quest-accept`, `.quest-link`, `.stat-value`, `.chart-tooltip`,
`.game-picker button`, `.data-table tbody tr`.

## Flows worth driving

1. Quest Board: 6 cards at Day 14 → accept 2–3 quests → tracked links appear.
2. Advance ~50 days (click `.btn-primary` in a loop, ~150ms settle each) →
   My Dashboard stats move: score, tier, multiplier, pending/settled money.
3. Hover a `.chart-card svg` → `.chart-tooltip` must appear.
4. Dev HQ → pick GRIDRUNNER:// → attribution table shows the 🤖 row with a
   "voided as fraud, refunded" note.
5. Trust & Safety → fraud log rows > 0 after ~30 days.
6. Reset → back to Day 14, zero player claims (StrictMode double-invoke is
   safe: the reducer is deterministic, seeded RNG).
7. Probes that matter: autoplay ticks ~1/900ms; 400px viewport must have zero
   horizontal overflow; console must stay error-free throughout.

## Gotchas

- The simulation is deterministic (seed 20260704) — expect the *same* numbers
  run-to-run; a diff in observed values means a code change, not noise.
- Balance checks are faster headless: `node -e "import('./src/engine/simulation.js').then(...)"`
  to fast-forward days and print scores/budgets — but that's for tuning, not
  verification; the UI drive above is the real check.
