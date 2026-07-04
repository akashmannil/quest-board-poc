# Commit 1 — Project skeleton & app shell

## What was done (in plain words)

This commit creates the empty "house" that every later feature will move into.
Think of it like pouring the foundation and putting up the walls before any
furniture arrives.

Concretely:

1. **Created the project with Vite + React.**
   - *React* is a popular library for building user interfaces out of small
     reusable pieces called *components*.
   - *Vite* is the tool that runs the app on your computer while developing and
     bundles it up for the web. You don't interact with it directly — it just
     makes `npm run dev` work.
2. **Deleted the demo content** that comes with a fresh Vite project (a spinning
   logo and a "count is 0" button). We don't need it.
3. **Built the app shell** — the purple **QuestBoard** header and the four
   navigation tabs you can click:
   - 🗺️ **Quest Board** — where promoters will browse games to promote.
   - 📈 **My Dashboard** — where a promoter will see their score and earnings.
   - 🎮 **Dev HQ** — where a game developer will see what their money bought.
   - 🛡️ **Trust & Safety** — how the platform will fight cheaters.

   Each tab currently shows a "will be built in an upcoming commit" placeholder.
4. **Defined the visual theme** in one CSS file: a dark background with a neon
   purple accent (a look gamers are at home with). All colors are stored as
   named *design tokens* (e.g. `--accent`) so changing the whole app's look
   later means editing one line, not fifty files.
5. **Rewrote the README** so anyone landing on the project understands the
   problem it tackles: indie games don't fail because they're bad — they fail
   because nobody sees them.

## Files worth looking at

| File | What it is |
| ---- | ---------- |
| `index.html` | The single web page the whole app lives in ("SPA" = Single Page App). |
| `src/main.jsx` | The ignition switch: takes our React app and puts it on the page. |
| `src/App.jsx` | The shell: header, tagline, and the four tab buttons. |
| `src/index.css` | The theme: every color, font and shared style in the app. |
| `README.md` | The project's front door: what QuestBoard is and why it exists. |

## How to see it

```bash
npm install   # one time: downloads the libraries the app needs
npm run dev   # starts the app; open the printed http://localhost:5173 link
```

You'll see the QuestBoard header and four clickable tabs, each showing a
placeholder for now.

## Words introduced in this commit

- **SPA (Single Page App):** a website that loads once and then swaps content
  with JavaScript instead of loading new pages — feels fast, like an app.
- **Component:** a self-contained piece of UI (a button, a card, a whole page)
  that React lets us reuse like Lego bricks.
- **Design token:** a named value (like `--accent: purple`) used everywhere
  instead of hard-coding colors, so the theme stays consistent.
