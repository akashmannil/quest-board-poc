# Commit 14 — Two quick feel fixes (line-height + scroll-to-top)

> Note: this documents the small polish commit that preceded the big motion
> pass in commit 15. (Numbering follows the git history.)

## What was done (in plain words)

Two things the user flagged after living with the redesign:

1. **The Discover text felt cramped.** The pixel body font (VT323) is tall and
   tight, so wrapped card titles, studio names and shelf copy were sitting too
   close together. Raised the base line-height (1.35 → 1.55) and heading
   line-height (→ 1.5), and stopped multi-word genre tags from splitting
   mid-name ("Bullet Hell" was breaking across two lines) by keeping each tag
   pill on one line.

2. **Opening a game left you mid-scroll.** Clicking a card near the bottom of
   the homepage opened the game page already scrolled halfway down. Added a
   scroll-to-top that fires whenever the screen or the open game changes, so
   every page starts at the top (verified: 1139px → 0 on opening a game).

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/index.css` | Line-height bumps; `white-space: nowrap` on tags. |
| `src/App.jsx` | The scroll-to-top effect keyed on the route. |
