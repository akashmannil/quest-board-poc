# Commit 9 — The neon arcade redesign (design system)

## What was done (in plain words)

The app got a complete visual identity transplant. The old look was a generic
"dark dashboard" — fine for a bank, wrong for a platform about indie games.
The new direction is **neon arcade × Minecraft**: the glow of a night-time
arcade cabinet on the blocky, beveled bones of a Minecraft menu.

### The ingredients

1. **Pixel fonts.** Two classic game fonts (loaded from Google Fonts):
   - *Press Start 2P* — the chunky 8-bit arcade font — for the logo, headings,
     buttons and labels.
   - *VT323* — an old CRT-terminal font — for body text and numbers, because
     a paragraph set in Press Start 2P would be unreadable.
2. **A pixel-art logo.** No image file: the new mark is a magenta pixel
   *shield* with a cyan pixel *sword* driven through it, drawn cell by cell
   in code (`src/components/Logo.jsx` is literally a 12×12 grid of letters,
   where `P` means a pink pixel and `C` a cyan one). The QUESTBOARD wordmark
   glows and has a subtle neon-sign flicker (disabled for people whose
   system asks for reduced motion).
3. **A pixel icon set.** `src/components/PixelIcon.jsx` holds ~19 hand-drawn
   8×8 icons — sword, map, gamepad, shield, star, key, coin, flame, crown,
   gem, rocket, sprout, skull, hourglass… Each is just 8 rows of text where
   `X` marks a filled square, rendered as crisp SVG rectangles. The nav tabs
   now use them (🗺️ emoji → pixel map icon, and so on).
4. **Minecraft-style surfaces.** Every panel and button lost its rounded
   corners and gained the classic bevel: a light edge on the top-left, a dark
   edge on the bottom-right, over a 2px black border. Pressing a button
   flips the bevel — it visually pushes *in*, like a Minecraft button.
5. **Neon everywhere it means something.** Cyan for navigation and headings,
   magenta for the brand, XP-green for money and progress, amber for the DAY
   counter (styled like an arcade score display). Glow is layered CSS
   shadows, never images.
6. **The room itself.** The page background is now a violet-black "night
   level" with a faint cyan pixel grid, and the whole screen sits behind
   very quiet CRT scanlines. The game-art banners on quest cards got their
   own scanline wash, like screens inside an arcade cabinet.
7. **XP bars.** Budget meters are now segmented, glowing green bars — read
   them exactly like the XP bar under a Minecraft hotbar.

### What deliberately did NOT change

- **Chart series colors.** They were validated for color-blind safety in
  commit 5, and the new panel color changed under them — so the palette was
  re-run through the validator against the new surface (`#14102a`) before
  keeping it. All checks still pass; the neon look on charts will come from
  glow effects, not from replacing the safe colors.
- **All class names and component logic.** This commit is CSS + three small
  files; the views get their icon pass in the next commit.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `src/index.css` | The whole design system, rewritten (~700 lines of tokens, bevels, glow). |
| `src/components/PixelIcon.jsx` | The 8×8 pixel icon set — icons as rows of text. |
| `src/components/Logo.jsx` | The shield-and-sword pixel logo. |
| `src/App.jsx` | New logo lockup + pixel-icon nav tabs. |
| `index.html` | Loads the two game fonts. |

## How to see it

`npm run dev` — the difference is the whole screen. Hover a quest card
(neon edge lights up), press any button (it pushes in), watch the logo
flicker once in a while.

## Words introduced in this commit

- **Bevel:** the fake-3D edge (light on one side, dark on the other) that
  makes a flat rectangle read as a raised block — the entire Minecraft UI
  is built from it.
- **Scanlines:** the faint horizontal lines of an old CRT screen, simulated
  with a repeating CSS gradient for the retro feel.
- **Design system:** the shared kit of tokens (colors, fonts, bevels, glows)
  every screen draws from, so the app looks like one game, not four apps.
