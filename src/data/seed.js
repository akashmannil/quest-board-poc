// ---------------------------------------------------------------------------
// Seed data: the fake indie games and promoters the PoC starts with.
// In a real product this would come from a database; here it's hand-written
// so the demo is interesting from the first click.
// ---------------------------------------------------------------------------

// Each game is a "quest" a promoter can accept. Bounties are what the dev
// pays per *verified* outcome (in USD). `appeal` is a hidden 0.7–1.3 factor
// the traffic simulator uses: some games simply convert better than others.
export const GAMES = [
  {
    id: "moonpetal",
    title: "Moonpetal Alley",
    studio: "Two Cats Studio",
    tags: ["Cozy", "Gardening", "Cat Café"],
    pitch:
      "Restore a moonlit alley into a garden café where stray cats become your regulars.",
    art: { emoji: "🌙", gradient: "linear-gradient(135deg, #2b2d5e, #7c5cff)" },
    bounties: { click: 0.02, wishlist: 0.45, demo: 0.2, key: 0.8 },
    budgetTotal: 900,
    keysAvailable: 40,
    appeal: 1.25,
  },
  {
    id: "gridrunner",
    title: "GRIDRUNNER://",
    studio: "Neon Debt Collective",
    tags: ["Roguelike", "Cyberpunk", "Action"],
    pitch:
      "Hack, dash and die fast in a neon grid where every run rewrites the city's code.",
    art: { emoji: "🌐", gradient: "linear-gradient(135deg, #0f3443, #4cc9f0)" },
    bounties: { click: 0.02, wishlist: 0.4, demo: 0.15, key: 0.7 },
    budgetTotal: 700,
    keysAvailable: 60,
    appeal: 1.05,
  },
  {
    id: "deepseadiner",
    title: "Deep Sea Diner",
    studio: "Anglerfish Games",
    tags: ["Cooking", "Management", "Underwater"],
    pitch:
      "Run the only diner at the bottom of the ocean. The customers glow. So does the soup.",
    art: { emoji: "🐟", gradient: "linear-gradient(135deg, #123c4e, #3ecf8e)" },
    bounties: { click: 0.02, wishlist: 0.5, demo: 0.25, key: 0.9 },
    budgetTotal: 1200,
    keysAvailable: 30,
    appeal: 1.15,
  },
  {
    id: "compostknights",
    title: "Knights of the Compost Heap",
    studio: "Soggy Cardboard",
    tags: ["Strategy", "Comedy", "Bugs"],
    pitch:
      "Lead an order of chivalrous beetles defending the garden's compost heap from wasp raiders.",
    art: { emoji: "🪲", gradient: "linear-gradient(135deg, #3d2b1f, #f5b342)" },
    bounties: { click: 0.02, wishlist: 0.35, demo: 0.15, key: 0.6 },
    budgetTotal: 400,
    keysAvailable: 80,
    appeal: 0.85,
  },
  {
    id: "lighthouse",
    title: "Echoes of the Lighthouse",
    studio: "Fog Signal Interactive",
    tags: ["Narrative", "Puzzle", "Mystery"],
    pitch:
      "Every night the lighthouse beam reveals a different decade. Piece together who never left.",
    art: { emoji: "🗼", gradient: "linear-gradient(135deg, #1a1a2e, #9aa1b5)" },
    bounties: { click: 0.02, wishlist: 0.55, demo: 0.3, key: 1.0 },
    budgetTotal: 700,
    keysAvailable: 25,
    appeal: 0.95,
  },
  {
    id: "bulletballet",
    title: "Bullet Ballet",
    studio: "One-Woman Orchestra",
    tags: ["Rhythm", "Bullet Hell", "Music"],
    pitch:
      "Dodge to the beat: every bullet pattern is choreography, every boss a movement of the score.",
    art: { emoji: "🩰", gradient: "linear-gradient(135deg, #4a1033, #ff5d6c)" },
    bounties: { click: 0.02, wishlist: 0.4, demo: 0.2, key: 0.75 },
    budgetTotal: 750,
    keysAvailable: 50,
    appeal: 1.1,
  },
];

// Promoters. `you` is the player of the demo: a total newcomer with score 0.
// The rivals exist so the leaderboard, the dev dashboard and the fraud panel
// have life in them. `reachBase` is the audience size the simulator assumes
// before the Exposure Score starts compounding it.
// `pattern` tweaks behaviour: "steady" | "weekend" | "bursty" | "bot".
export const PROMOTERS = [
  {
    id: "you",
    name: "You",
    handle: "@brand_new_you",
    channel: "Just getting started",
    avatar: "🫵",
    isPlayer: true,
    score: 0,
    reachBase: 80,
    pattern: "steady",
  },
  {
    id: "priya",
    name: "PixelPriya",
    handle: "@pixelpriya",
    channel: "Twitch · 48k followers",
    avatar: "🎙️",
    isPlayer: false,
    score: 720,
    reachBase: 800,
    pattern: "steady",
  },
  {
    id: "carlos",
    name: "CozyCarlos",
    handle: "@cozycarlos",
    channel: "YouTube · 12k subs",
    avatar: "🎬",
    isPlayer: false,
    score: 430,
    reachBase: 380,
    pattern: "weekend",
  },
  {
    id: "nina",
    name: "NightOwlNina",
    handle: "@nightowl.nina",
    channel: "TikTok · 7k followers",
    avatar: "🦉",
    isPlayer: false,
    score: 260,
    reachBase: 240,
    pattern: "bursty",
  },
  {
    id: "ben",
    name: "BlogByBen",
    handle: "@blogbyben",
    channel: "Newsletter · 900 readers",
    avatar: "📰",
    isPlayer: false,
    score: 120,
    reachBase: 100,
    pattern: "steady",
  },
  {
    id: "sus99",
    name: "TurboClicks99",
    handle: "@turboclicks99",
    channel: "Unknown traffic source",
    avatar: "🤖",
    isPlayer: false,
    score: 180,
    reachBase: 120,
    pattern: "bot", // the Trust & Safety panel will catch this one
  },
];
