# Commit 2 — The Exposure Score engine + seed data

## What was done (in plain words)

This commit builds the **brain** of QuestBoard: the math that decides how much
a promoter earns and how their reputation grows. There is still nothing new to
see on screen — like an engine sitting on a workbench before it's put in the
car. The next commit wires it up.

### The Exposure Score, explained with a story

Imagine two people join QuestBoard on the same day:

- **You**, with no followers at all.
- **PixelPriya**, a streamer with 48,000 followers.

Both promote the same game with a **$0.45 per wishlist** bounty. QuestBoard
multiplies that bounty by a number based on your **Exposure Score**:

| Score | Multiplier | $0.45 bounty becomes | Feels like |
| ----- | ---------- | -------------------- | ---------- |
| 0     | 0.27×      | $0.12                | Newcomer — small, but **never zero** |
| 250   | 0.64×      | $0.29                | Growth picking up speed |
| 400   | 1.63×      | $0.73                | The steepest part — every day of work visibly pays more |
| 600   | 2.77×      | $1.25                | Near the top |
| 1000  | 3.00×      | $1.35                | The ceiling — it never goes higher |

Plotted, this makes an **S-shaped curve** (mathematicians call it *logistic*):
flat at the start, steep in the middle, flat again at the top. That shape was
chosen deliberately:

1. **Beginners earn from day one** — a small cut beats a locked door.
2. **The middle is steep** — consistent work makes income grow almost
   exponentially, which is the incentive to keep going.
3. **There's a ceiling** — superstars can't hoover up infinite money, so
   games stay affordable for devs and newcomers always have room to climb.

### How the score itself grows

You gain score only from **verified outcomes**, never from raw activity —
posting 100 times earns nothing if nobody acts on it:

- Steam wishlist: **+1.0** &nbsp;·&nbsp; demo download: **+0.5** &nbsp;·&nbsp;
  game key redeemed: **+1.5** &nbsp;·&nbsp; link click: **+0.02**

Two extra rules shape behaviour:

- **Streak bonus:** every consecutive active day adds +15% to that day's score
  gains, capped at 3×. Showing up daily *compounds*.
- **Decay:** every silent day costs ~0.6% of your score. A month off ≈ −17%.
  You can't squat on old glory.

And one anti-cheat rule: **earnings stay "pending" for 7 days** before they
settle, giving the platform time to void fake outcomes before money moves.

### The seed data

The file `src/data/seed.js` invents the world the demo runs in:

- **6 indie games** (e.g. *Moonpetal Alley*, a cat-café gardening game, and
  *GRIDRUNNER://*, a cyberpunk roguelike), each with its own bounty prices,
  ad budget, and a hidden "appeal" number — some games just convert better.
- **6 promoters**: you (score 0), four believable rivals of various sizes,
  and one shady account, **TurboClicks99**, whose fake-looking traffic the
  Trust & Safety panel will catch in a later commit.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/engine/exposure.js` | All the math above, in ~100 lines with comments. |
| `src/data/seed.js` | The 6 fake games and 6 promoters the demo starts with. |

## How to check it works (optional, for the curious)

The app looks the same as commit 1, but you can poke the engine directly:

```bash
node -e "import('./src/engine/exposure.js').then(m => console.log(m.payoutMultiplier(400)))"
# prints ~1.63 — the multiplier at score 400
```

## Words introduced in this commit

- **Bounty:** the price a developer pays for one verified outcome (e.g. $0.45
  per wishlist).
- **Logistic / S-curve:** a growth curve that starts flat, rises steeply, then
  flattens at a ceiling.
- **Multiplier:** the number (0.25×–3×) your Exposure Score turns bounties into
  actual earnings with.
- **Settlement:** the 7-day waiting period before pending earnings become real,
  used as a fraud safety net.
- **Seed data:** hand-written fake data that makes a demo feel alive without a
  real database.
