# Commit 18 — Phone-width fix: teaching grids to let go

## What was done (in plain words)

While driving the new attract screen at a phone width (400px), the
verification probe caught something older than the feature being tested:
**three screens were wider than the phone.** Discover overflowed by 392px,
Dev HQ by 104px, My Dashboard by 68px — the page could be dragged sideways,
with the layout spilling past the right edge. The check that "400px must
have zero horizontal overflow" had only ever been pointed at some screens,
and these three had quietly regressed as they grew richer.

### The culprit: a CSS default almost nobody expects

A grid item's minimum width is not 0 — it's `auto`, which means "never
shrink below my content's natural width." Usually invisible; fatal in two
places here:

1. **Discover's split section** holds a shelf whose card row is 4 × 210px ≈
   800px of content. The row itself scrolls sideways, but the *grid column
   holding it* refused to shrink below those 800px — so the column, and the
   whole page, ballooned to 800px on a 400px phone.
2. **Dashboard and Dev HQ cards** hold wide tables. Same story: the card
   would not shrink below its table.

The fix is the one-liner every CSS veteran eventually memorizes:
`min-width: 0` on the grid's children — "you're allowed to shrink; let the
scroll container inside you do its job."

### Plus one missing wrapper

Dev HQ's attribution table was already wrapped in a `.table-scroll` div (a
box that scrolls sideways on its own). The dashboard's three tables —
leaderboard, my quests, recent activity — never got the same wrapper, so
once their cards *could* shrink, the tables poked out of them instead of
scrolling. All three are now wrapped in the same idiom.

## Verified

Headless Chrome at 400px, driving every tab: Discover, Quest Board, My
Dashboard, Dev HQ, Trust & Safety, Guide and an open game page all report
**zero horizontal overflow** — including the dashboard after 30 simulated
days, when its tables are full of real rows. A 1280px screenshot confirms
the desktop dashboard is pixel-identical. Zero console errors.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/index.css` | The two `min-width: 0` rules with comments explaining the trap. |
| `src/views/PromoterDashboard.jsx` | Three tables gaining the `.table-scroll` wrapper Dev HQ already used. |

## How to see it

`npm run dev`, open DevTools device mode at 400px (or just make the window
narrow), and visit Discover and My Dashboard. Before this commit the page
scrolled sideways; now only the card shelves and tables scroll, inside
their own boxes.

## Words introduced in this commit

- **`min-width: auto`:** the flexbox/grid default that forbids an item from
  shrinking below its content — the single most common cause of "my page
  overflows on mobile."
- **Intrinsic (content) size:** how big an element "wants" to be based on
  what's inside it, before the layout squeezes or stretches it.
- **Regression:** a bug in something that used to work, introduced while
  building something else — the reason verification re-checks old promises,
  not just the new feature.
