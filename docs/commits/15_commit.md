# Commit 15 — Motion & feel: smooth animations everywhere

## What was done (in plain words)

The app worked and looked right, but it felt *static* — clicks and screen
changes just snapped. This commit adds a cohesive **motion layer** so the
whole thing feels like a responsive app: everything you touch responds
smoothly, every screen animates in, and the showpiece elements get living
gradient borders. Crucially, none of it gets in the way — it's all fast, and
it fully switches off for people who ask for reduced motion.

### What now moves

1. **Page transitions.** Switching tabs (or opening a game) fades and slides
   the new screen in. It's keyed so it replays on every navigation — but *not*
   when the simulation advances, so autoplay never flashes.
2. **Staggered entrance.** When a screen mounts, its pieces rise into place one
   beat after another — stat tiles, quest cards, homepage shelves, the game
   layout. The cascade is capped so an 18-card grid doesn't crawl in.
3. **Hover lifts, everywhere clickable.** Cards, quest tiles, stat tiles,
   momentum rows and genre chips lift a few pixels with a soft glow on hover,
   and press back down on click — consistent physical feedback that tells you
   what's interactive.
4. **A living gradient border** on the featured hero: a pink → cyan → purple
   gradient flows continuously around its edge (done with a padding-box /
   border-box gradient that animates its position — no images, no extra DOM).
5. **Button sheen.** Primary buttons ("Advance day", "Accept quest") get a
   light streak that sweeps across on hover, like a glossy arcade button.
6. **Animated nav underline.** The tab underline (a pink→cyan gradient) grows
   out from the center on hover and for the active tab.
7. **Progress bars glide.** Budget bars, the XP-to-next-tier bar and the
   attribution share bars now *animate* to their new width as the numbers
   change during autoplay, so you can watch a budget drain in real time.
8. **Small confirmations.** The DAY counter pulses each time it ticks up, your
   posted review pops in with a slight bounce, and interactive rating stars
   scale up as you hover them.
9. **The logo mark gently floats.**

### The motion vocabulary (why it feels consistent)

Two shared easing curves do all the work: a smooth `--ease` for movement and a
slightly springy `--ease-bounce` for confirmations. Because every animation
pulls from the same two curves and similar short durations (0.12s–0.42s), the
whole app moves like one thing rather than a pile of unrelated effects.

### Accessibility: motion is a preference

The entire block is wrapped so that under the operating system's
"reduce motion" setting, every transition and animation collapses to nothing
(the app stays 100% usable — the gradient border just freezes at a nice
position). Motion should never be mandatory.

### Verified

Driven in a real browser: after the entrance animations settle, every element
is fully visible (opacity 1 — nothing stuck mid-fade); navigating between
screens animates cleanly; and running autoplay for several days advances the
counter *without* the view flashing or re-animating (confirming the transition
is keyed correctly). Zero console errors.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/index.css` | The whole motion & effects block, plus the hero's animated gradient border and the reduced-motion override. |
| `src/App.jsx` | The keyed `.view-anim` wrapper that drives page transitions. |
| `src/components/DayControls.jsx` | The DAY badge keyed to re-pulse on each tick. |

## How to see it

`npm run dev`. Click between tabs — watch each screen rise in. Hover the cards
and buttons. Open a game (it slides in from the top). Hit **▶ Autoplay** and
watch the budget/XP bars glide and the DAY counter pulse. Then turn on your OS
"reduce motion" setting and reload — it all goes calm and instant.

## Words introduced in this commit

- **Easing curve:** the "shape" of a motion over time (slow-fast-slow, or a
  slight overshoot) — the difference between a movement that feels mechanical
  and one that feels natural.
- **Staggered animation:** starting each item's entrance slightly after the
  last, so a group arrives as a graceful cascade instead of all at once.
- **Fill mode (`both`):** tells an animation to hold its final frame so
  elements stay put after they've arrived, instead of snapping back.
- **`prefers-reduced-motion`:** an OS accessibility setting; respecting it is
  standard practice, because motion can cause real discomfort for some people.
