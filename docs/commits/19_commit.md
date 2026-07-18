# Commit 19 — Breathing room: the button that stole the fonts

## What was done (in plain words)

Several blocks of text sat with their lines almost touching — the featured
hero's pitch on Discover was three lines of tightly stacked capitals, the
"genres gaining pace" rows were cramped two-liners, the header tagline
wrapped into a squeezed clump on phones. Instead of nudging line-heights one
element at a time, this commit hunted the disease, and it turned out to be
one line of CSS with two side effects.

### The culprit: `font: 10px var(--font-pixel)` on `button`

The design system styles every `<button>` with the CSS `font` *shorthand*.
Two things about that shorthand are easy to forget:

1. It **resets `line-height` to `normal`** (about 1.2) — even if you never
   mentioned line-height. Fine for a one-line label; cramped the moment a
   label wraps.
2. Everything *inside* the button **inherits** that pixel font family (and
   the button's `text-transform: uppercase`), unless it explicitly opts out.

Side effect 2 had quietly rewritten whole components. When the redesign
made cards clickable, the featured hero, game cards, momentum rows and
genre chips became `<button>`s — and their body copy (pitches, studio
names, wishlist counts, at 13–18px sizes chosen for the VT323 body font)
silently flipped to uppercase Press Start 2P at line-height normal. The
proof it was accidental sat one click away: the *same* pitch and studio
text on the game page (a plain `<div>`) rendered in the body font, sentence
case, comfortably spaced. On cards, the faint studio name even rendered
*louder than the game's title* — an inverted hierarchy nobody designed.

### The fix, in three layers

1. **`line-height: 1.5` on the base `button` rule** — every wrapped pixel
   label (nav tabs, tagline, primary buttons) breathes again, everywhere at
   once.
2. **Reading defaults for the clickable cards.** `.hero`, `.game-card`,
   `.momentum-row` and `.genre-chip` get `font-family: var(--font-body)`,
   `text-transform: none` and `line-height: 1.5` — the same inheritance a
   `<div>` would have given them (the quest cards, which are divs, never
   had the problem). Every deliberate pixel accent inside them — kickers,
   CTAs, growth badges, the hero's title — declares its own font and is
   untouched.
3. **Spot fixes where the shorthand strikes again.** Rules like
   `.data-table th`, `.stat-label` and `.shelf-head h3` use their own
   `font:` shorthand (which resets line-height *again*), so the ones whose
   text can wrap get an explicit `line-height: 1.5`. The Guide/intro body
   copy at 1.4 was nudged to 1.5 to match the app's 1.55 body rhythm.

The result is easy to see on Discover: the hero pitch is one calm body-font
line instead of three shouting ones, card titles outrank their studios
again, and the genre chips finally show real lowercase.

## Verified

An automated audit in headless Chrome walked every element with direct text
across all six tabs, a game page and the intro overlay, at 1280px and
400px, flagging anything rendering on 2+ lines with a line-height ratio
under 1.4. Before: cramped hits on every screen (ratio ~1.2). After: zero
flags anywhere. All tabs still report zero horizontal overflow at 400px,
and the console stays error-free. Before/after screenshots confirmed the
hero, cards, momentum rows, genre chips, intro and game page.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/index.css` | The button `line-height`, the card-reset block (with the why-comment), and the spot fixes. |

## How to see it

`npm run dev` → look at the featured hero's pitch and the "genres gaining
pace" rows on Discover, then open any game page and notice the hero now
matches it. Narrow the window to phone width and watch the tagline wrap
with air between the lines.

## Words introduced in this commit

- **CSS `font` shorthand:** one property that sets family, size *and*
  resets style, weight and line-height in a single line — including the
  ones you didn't mention. Powerful, and the classic source of "where did
  my line-height go?"
- **Inheritance:** text properties (font, line-height, text-transform) flow
  from parent to child unless overridden — so styling a `<button>` styles
  everything you later nest inside it.
- **Visual hierarchy:** the size/weight order that tells a reader what
  matters most; a bug that renders a subtitle bolder than its title breaks
  the page's meaning without breaking any code.
