# Commit 7 — Trust & Safety panel + final polish

## What was done (in plain words)

The last tab, 🛡️ **Trust & Safety**, is now real — and it exists because of an
uncomfortable truth: **any platform that pays cash for internet activity gets
attacked almost immediately**. Click farms, bots, self-referrals. If QuestBoard
can't answer "how do you stop cheaters?", neither devs nor honest promoters
would trust it with money. A credible defense story is a *feature*, not an
afterthought.

### What's on the screen

1. **Four stat tiles** — how many fraud flags this run has raised, how much
   payout money was withheld, how much was refunded to developers, and which
   accounts were caught.
2. **Six defense cards** — each one either marked **"simulated in this PoC"**
   (it genuinely runs in the code you've been playing with) or **"design
   note"** (what a production version would add). Honesty about which is
   which is deliberate:
   - Pay for outcomes, never activity *(simulated)*
   - 7-day settlement window *(simulated)*
   - Velocity + conversion anomaly detection *(simulated)*
   - Reputation fraud can't buy — score penalty + gain cap *(simulated)*
   - Devs never pay for voided traffic *(simulated, added in commit 6)*
   - Fingerprinting, identity checks, manual review *(design note)*
3. **The fraud log** — the live table of every voided day, newest first, each
   with the detector's reasoning in plain words: *"1,240 clicks (9.3× their
   average) but only 0.4% converted — traffic voided, payout withheld."*

### Why the detection works (the one-paragraph version)

Real virality and purchased clicks look identical in volume — both are big
spikes. They differ in **conversion**: real fans who click also wishlist
(20%+), while a click farm's bots click and vanish (<1%). So the detector
needs *both* signals: a spike **5× above the account's own recent average**
*and* **conversion below 3%**. NightOwlNina's viral TikTok days spike just as
hard as the bot's purchases, but her clicks convert — she never gets flagged.
That's the difference between catching fraud and punishing success.

### Also in this commit

- The README got its final shape: the four screens, the incentive math in
  five lines, and an honest "deliberate omissions" list.
- Removed leftover dead code (the placeholder styles from commit 1 and an
  unused helper) — finished houses don't keep the scaffolding.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/views/TrustSafety.jsx` | The whole panel: tiles, defense cards, fraud log. |
| `README.md` | The project's finished front door. |

## How to see it

`npm run dev` → **▶ Autoplay** for \~30 days → **Trust & Safety**. Watch the
flag counter tick up every \~5 days (TurboClicks99's purchase schedule), then
cross-check in **Dev HQ** → *GRIDRUNNER://* that the same money shows up as
"voided as fraud, refunded".

## Words introduced in this commit

- **Void:** cancelling an outcome before its money settles — the promoter
  isn't paid and the developer is refunded, as if it never happened.
- **Velocity check:** comparing today's volume against the account's own
  recent history instead of a global threshold, so big and small accounts are
  judged fairly against themselves.
- **False positive:** an honest user wrongly flagged — the reason the detector
  requires *two* independent signals (spike + dead conversion), not one.
