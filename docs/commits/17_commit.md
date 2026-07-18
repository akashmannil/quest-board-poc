# Commit 17 — The attract screen: welcoming Player One

## What was done (in plain words)

Commit 16 gave the app a manual, but a manual only helps people who go
looking for one. A brand-new visitor still landed cold on a wall of neon
numbers with no idea what QuestBoard *is*. Arcade cabinets solved this
problem forty years ago: when nobody's playing, the machine explains itself —
the **attract screen**. So that's what the first visit gets.

### The welcome, in the app's own language

Open QuestBoard for the first time and an overlay rises over the dimmed app:
a blinking `INSERT COIN · FREE PLAY` line, the shield-and-sword mark, and
**"WELCOME, PLAYER ONE."** Under it, the pitch in two sentences and the whole
game in three numbered panels — *Pick a quest* (devs pay per verified
outcome), *Share your link* (outcomes are yours after the 7-day fraud
check), *Level up* (streaks and tiers grow the same wishlist to 3× pay).

An amber callout handles the thing that confuses every first-time viewer of
a simulation: **"Time is a button here"** — nothing moves until you press
⏭ Advance day, because the whole world is simulated in your browser.

Two exits: **▶ PRESS START** drops you into the app; **READ THE PLAYER'S
GUIDE** lands on the manual from commit 16. The two features click together:
the overlay is the 15-second version, the Guide is the 2-minute one.

### Politeness rules (the details that matter)

1. **Shown once.** A `localStorage` flag (`questboard.introSeen.v1`)
   remembers the dismissal; reloads and resets never nag. The `.v1` suffix
   is deliberate — bump it after a big redesign and everyone gets one fresh
   welcome.
2. **Three ways out.** Press start, the Escape key, or clicking the darkness
   around the card. No forced tour, no "next" carousel — respect for the
   player's time is part of the app's voice.
3. **Replayable.** The Guide's footer grows a "▶ Replay the intro" button,
   so the welcome isn't a one-time ghost you can never show a friend.
4. **Inside the cabinet.** The overlay's z-index sits deliberately *below*
   the CRT scanline layer, so even the welcome screen renders behind the
   scanlines — and its border runs the same flowing pink→cyan→purple
   gradient as the featured hero. Under `prefers-reduced-motion` the blink
   and border-flow freeze like everything else.

### One quiet signpost after that

Until the first quest is accepted, the Discover header carries a single
extra line — "First time on the board? The Player's Guide explains the whole
loop in two minutes." — which deletes itself forever the moment you claim a
quest. Onboarding that knows when to shut up.

## Verified

Driven headless in real Chrome against the production build, fresh profile:
the overlay appears on first load; Press start dismisses it and sets the
flag; a reload stays clean; the Guide button lands on the manual; Escape and
backdrop clicks both close it; "Replay the intro" brings it back; the
Discover hint shows for a claimless player, navigates to the Guide, and
disappears after accepting a quest; at 400px the card fits with the start
button reachable. Zero console errors throughout. (The 392px horizontal
overflow observed on Discover at 400px predates this commit — confirmed by
rebuilding the previous commit — and is fixed in commit 18.)

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/components/IntroModal.jsx` | The attract screen + the localStorage memory. |
| `src/App.jsx` | Owns the show/hide state; wires "replay" through the Guide. |
| `src/views/Discover.jsx` | The self-deleting new-player hint. |
| `src/index.css` | The `first-run intro` block: overlay, gradient card, coin blink. |

## How to see it

`npm run dev` in a private/incognito window (or clear the
`questboard.introSeen.v1` key in DevTools → Application → Local Storage).
The welcome greets you; dismiss it, reload, and note it stays gone. Find it
again at the bottom of the **Guide** tab.

## Words introduced in this commit

- **Attract screen:** the self-running demo an arcade cabinet shows between
  players — the original "explain the game before anyone commits a coin."
- **First-run experience:** everything an app does differently the very
  first time it's opened; good ones are skippable, short, and never repeat.
- **`localStorage`:** a small key-value store the browser keeps per site —
  survives reloads, so it's how a frontend-only app remembers "you've been
  here before."
