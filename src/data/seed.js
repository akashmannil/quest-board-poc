// ---------------------------------------------------------------------------
// Seed data: the fake indie games and promoters the PoC starts with.
// In a real product this would come from a database; here it's hand-written
// so the demo is interesting from the first click.
//
// Each game is a "quest" a promoter can accept. Bounties are what the dev
// pays per *verified* outcome (in USD). `appeal` is a hidden 0.7–1.3 factor
// the traffic simulator uses: some games simply convert better than others.
// `listedDay` is when the game joined QuestBoard (drives the "new" shelf),
// `dev` powers the developer card on the game page, and `reviews` seed the
// comments section.
// ---------------------------------------------------------------------------

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
    listedDay: 0,
    dev: {
      location: "Busan, South Korea",
      teamSize: 2,
      founded: 2023,
      bio: "A married couple and their two very demanding cats. Moonpetal Alley is their first commercial game, built at the kitchen table after work.",
    },
    reviews: [
      { author: "sleepygardener", rating: 5, day: 4, text: "Watered a digital fern for three hours and felt feelings. The cats remember your name." },
      { author: "cafe_crawler", rating: 4, day: 9, text: "Cozy without being empty — the alley actually changes as regulars move in. Wishlist it for the soundtrack alone." },
    ],
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
    listedDay: 0,
    dev: {
      location: "Rotterdam, Netherlands",
      teamSize: 4,
      founded: 2021,
      bio: "Four ex-web-devs who decided the daily stand-up should be a boss fight. Known for punishing but fair difficulty curves.",
    },
    reviews: [
      { author: "dash_cancel", rating: 5, day: 3, text: "Died 41 times before the first boss and grinned the whole way. The dash-hack combo is pure dopamine." },
      { author: "crt_enjoyer", rating: 4, day: 11, text: "Runs melt into each other in the best way. Needs a colorblind mode for the firewall tiles though." },
    ],
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
    listedDay: 0,
    dev: {
      location: "Wellington, New Zealand",
      teamSize: 3,
      founded: 2022,
      bio: "Three marine-biology dropouts who kept the fish obsession. Every customer species in the game is based on a real deep-sea creature.",
    },
    reviews: [
      { author: "brothlord", rating: 5, day: 6, text: "The anglerfish critic made me redo my kelp ramen five times. Deserved. Game of the year in my trench." },
      { author: "midnight_zone", rating: 5, day: 13, text: "Management sim where the rush hour is bioluminescent. Genuinely beautiful and genuinely stressful." },
    ],
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
    listedDay: 0,
    dev: {
      location: "Bristol, UK",
      teamSize: 1,
      founded: 2024,
      bio: "One person, one garden, one deeply unserious strategy game. The wasp faction was designed after a real picnic incident.",
    },
    reviews: [
      { author: "sir_rolypoly", rating: 4, day: 7, text: "Knighted a dung beetle and cried at his funeral two missions later. Tactical AND emotional damage." },
    ],
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
    listedDay: 0,
    dev: {
      location: "Halifax, Canada",
      teamSize: 2,
      founded: 2020,
      bio: "A writer and a programmer who met in a lighthouse-keeping forum. Yes, that exists. Their games are slow, foggy and devastating.",
    },
    reviews: [
      { author: "foghorn_leg", rating: 5, day: 5, text: "Solved the 1962 night and had to sit quietly for a while. The beam mechanic is genius." },
      { author: "puzzle_gran", rating: 4, day: 12, text: "Gentle puzzles, heavy story. Bring tissues and a notebook." },
    ],
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
    listedDay: 0,
    dev: {
      location: "Kraków, Poland",
      teamSize: 1,
      founded: 2022,
      bio: "A former ballet accompanist who scores every level on a real piano first, then builds the bullet patterns to match the sheet music.",
    },
    reviews: [
      { author: "graze_master", rating: 5, day: 8, text: "The waltz boss made me a better person. First bullet hell where dying feels like missing a step, not being cheated." },
      { author: "tempo_tantrum", rating: 4, day: 10, text: "Brutal on keyboard, sublime on controller. The soundtrack has lived in my head for a week." },
    ],
  },
  {
    id: "channel13",
    title: "Channel 13",
    studio: "Dead Air Studio",
    tags: ["Horror", "Narrative", "VHS"],
    pitch:
      "A late-night TV station keeps broadcasting after sign-off. Someone has to watch the tapes.",
    art: { emoji: "📺", gradient: "linear-gradient(135deg, #1c0b0b, #a63a3a)" },
    bounties: { click: 0.02, wishlist: 0.5, demo: 0.25, key: 0.85 },
    budgetTotal: 850,
    keysAvailable: 45,
    appeal: 1.2,
    listedDay: 9,
    dev: {
      location: "Portland, USA",
      teamSize: 3,
      founded: 2021,
      bio: "Three horror nerds with a garage full of real VHS decks. All the tape distortion in the game is captured from physical cassettes.",
    },
    reviews: [
      { author: "rewind_kid", rating: 5, day: 11, text: "Watched a tape at 2am and my actual TV turned on by itself. Refusing to believe that's a coincidence. 10/10." },
      { author: "static_cling", rating: 4, day: 13, text: "The analog dread is immaculate. A little short, but the ending loops back in a way I still think about." },
    ],
  },
  {
    id: "gravegardener",
    title: "Grave Gardener",
    studio: "Marigold & Bone",
    tags: ["Cozy", "Horror", "Gardening"],
    pitch:
      "Tend the cemetery garden. The residents have opinions, requests, and unfinished business.",
    art: { emoji: "🪦", gradient: "linear-gradient(135deg, #14231a, #7fae6b)" },
    bounties: { click: 0.02, wishlist: 0.45, demo: 0.2, key: 0.8 },
    budgetTotal: 650,
    keysAvailable: 55,
    appeal: 1.15,
    listedDay: 10,
    dev: {
      location: "Tallinn, Estonia",
      teamSize: 2,
      founded: 2023,
      bio: "Two friends who worked summers as actual groundskeepers. They insist the cozy-horror tone is 'just how cemeteries feel at 6am'.",
    },
    reviews: [
      { author: "moss_witch", rating: 5, day: 12, text: "Planted marigolds on a ghost's grave and she taught me her pie recipe. This game understands gentleness." },
      { author: "nightshift_nora", rating: 5, day: 13, text: "Cozy-horror is a tightrope and this walks it perfectly. The 6am fog is the best skybox in indie games." },
    ],
  },
  {
    id: "clockworkbakery",
    title: "Clockwork Bakery",
    studio: "Brass Whisk",
    tags: ["Management", "Puzzle", "Steampunk"],
    pitch:
      "Route dough through brass pipes and gear-driven ovens. Efficiency is delicious.",
    art: { emoji: "🥨", gradient: "linear-gradient(135deg, #2e1f0e, #d9973b)" },
    bounties: { click: 0.02, wishlist: 0.4, demo: 0.2, key: 0.7 },
    budgetTotal: 600,
    keysAvailable: 60,
    appeal: 0.95,
    listedDay: 3,
    dev: {
      location: "Lyon, France",
      teamSize: 2,
      founded: 2022,
      bio: "A factory-game programmer and a pastry chef who married and merged professions. Every recipe in the game bakes in real life.",
    },
    reviews: [
      { author: "ratio_goblin", rating: 4, day: 6, text: "It's Factorio for people who smell like cinnamon. The croissant lamination puzzle broke my brain in a good way." },
    ],
  },
  {
    id: "voidcrawlers",
    title: "Voidcrawlers",
    studio: "Last Light Collective",
    tags: ["Roguelike", "Horror", "Sci-Fi"],
    pitch:
      "Your salvage crew wakes on a derelict ship that is bigger on the inside. Every run, it grows.",
    art: { emoji: "👾", gradient: "linear-gradient(135deg, #0e0b24, #6a3bbf)" },
    bounties: { click: 0.02, wishlist: 0.45, demo: 0.2, key: 0.8 },
    budgetTotal: 800,
    keysAvailable: 50,
    appeal: 1.0,
    listedDay: 5,
    dev: {
      location: "Helsinki, Finland",
      teamSize: 5,
      founded: 2019,
      bio: "Five veterans of a cancelled AAA horror project who kept the monsters and lost the publisher. The ship layout is genuinely procedural — even they get lost.",
    },
    reviews: [
      { author: "airlock_andy", rating: 4, day: 8, text: "The ship remembering your previous corpses is nasty in the best way. Co-op when??" },
      { author: "flare_hoarder", rating: 5, day: 12, text: "Scariest roguelike I've played. The sound design alone deserves an award." },
    ],
  },
  {
    id: "petalblade",
    title: "Petal & Blade",
    studio: "Paper Lantern Works",
    tags: ["Action", "Narrative", "Samurai"],
    pitch:
      "A wandering swordswoman trades duels for stories in a crumbling floating empire.",
    art: { emoji: "🌸", gradient: "linear-gradient(135deg, #3a0f1e, #ff7aa8)" },
    bounties: { click: 0.02, wishlist: 0.5, demo: 0.25, key: 0.9 },
    budgetTotal: 950,
    keysAvailable: 35,
    appeal: 1.2,
    listedDay: 2,
    dev: {
      location: "Kyoto, Japan",
      teamSize: 6,
      founded: 2020,
      bio: "A six-person studio above a real paper-lantern shop. Duels are animated first with ink on paper, then rebuilt in-engine frame by frame.",
    },
    reviews: [
      { author: "iaido_ida", rating: 5, day: 4, text: "Every duel is a conversation and the parry timing is poetry. The petal counter at the end got me." },
      { author: "haiku_harry", rating: 4, day: 9, text: "Combat is one-hit-kill both ways and completely fair. Story quietly devastating." },
    ],
  },
  {
    id: "stardepot",
    title: "Star Depot",
    studio: "Cargo Cult Games",
    tags: ["Management", "Sandbox", "Space"],
    pitch:
      "Run the last truck stop before deep space. Fuel, noodles, and questionable cargo.",
    art: { emoji: "🛰️", gradient: "linear-gradient(135deg, #0b1b33, #4f8fe8)" },
    bounties: { click: 0.02, wishlist: 0.35, demo: 0.15, key: 0.65 },
    budgetTotal: 500,
    keysAvailable: 70,
    appeal: 0.9,
    listedDay: 6,
    dev: {
      location: "Austin, USA",
      teamSize: 3,
      founded: 2023,
      bio: "Two ex-logistics programmers and a sci-fi novelist. Every alien trucker has a full backstory you will never see but they insist it matters.",
    },
    reviews: [
      { author: "docking_bay_dan", rating: 4, day: 10, text: "Sold noodles to a sentient nebula. Deep sandbox under the jokes — my depot runs itself now and I just watch." },
    ],
  },
  {
    id: "molepatrol",
    title: "Mole Patrol",
    studio: "Underfoot Interactive",
    tags: ["Strategy", "Cozy", "Animals"],
    pitch:
      "Command a burrow of earnest moles digging to save their meadow from developers.",
    art: { emoji: "🐹", gradient: "linear-gradient(135deg, #241a10, #b98a4e)" },
    bounties: { click: 0.02, wishlist: 0.3, demo: 0.15, key: 0.6 },
    budgetTotal: 350,
    keysAvailable: 90,
    appeal: 0.8,
    listedDay: 7,
    dev: {
      location: "Leipzig, Germany",
      teamSize: 2,
      founded: 2024,
      bio: "Two landscape architects making games about the ground. The dig physics are based on real soil-mechanics tables, because of course they are.",
    },
    reviews: [
      { author: "tunnel_visionary", rating: 4, day: 9, text: "Turn-based digging sounds boring until the water table shifts and your whole west wing floods. Moles salute you, sir." },
    ],
  },
  {
    id: "neongrimoire",
    title: "Neon Grimoire",
    studio: "Hexadecimal Coven",
    tags: ["Roguelike", "Deckbuilder", "Magic"],
    pitch:
      "Cast spells by chaining glowing cards; your spellbook corrupts a little more each run.",
    art: { emoji: "🔮", gradient: "linear-gradient(135deg, #190b2e, #b45cff)" },
    bounties: { click: 0.02, wishlist: 0.45, demo: 0.2, key: 0.75 },
    budgetTotal: 900,
    keysAvailable: 40,
    appeal: 1.25,
    listedDay: 11,
    dev: {
      location: "Mexico City, Mexico",
      teamSize: 4,
      founded: 2021,
      bio: "Four friends from a Magic: The Gathering league who wanted corruption mechanics their judge wouldn't allow. The card glow is hand-painted.",
    },
    reviews: [
      { author: "mana_screwed", rating: 5, day: 12, text: "The corruption system is evil genius — your best card slowly becomes your worst enemy. Run 30 and still finding combos." },
      { author: "topdeck_tina", rating: 5, day: 13, text: "Best deckbuilder since Slay the Spire and I will die on this glowing hill." },
    ],
  },
  {
    id: "longferry",
    title: "The Long Ferry",
    studio: "Slow Water Games",
    tags: ["Narrative", "Cozy", "Boats"],
    pitch:
      "Ferry passengers across a vast lake. Everyone aboard has one story and one stop.",
    art: { emoji: "⛴️", gradient: "linear-gradient(135deg, #0f2a2a, #58b3a4)" },
    bounties: { click: 0.02, wishlist: 0.4, demo: 0.2, key: 0.7 },
    budgetTotal: 550,
    keysAvailable: 65,
    appeal: 1.05,
    listedDay: 4,
    dev: {
      location: "Bergen, Norway",
      teamSize: 1,
      founded: 2022,
      bio: "A former ferry deckhand who wrote down every conversation worth keeping for eleven years. About half of them are in the game, names changed.",
    },
    reviews: [
      { author: "fjord_focus", rating: 5, day: 7, text: "A game about listening. The old fisherman's stop made me call my dad." },
      { author: "deckchair_dee", rating: 4, day: 11, text: "Nothing happens and everything happens. Play it on a rainy evening." },
    ],
  },
  {
    id: "bitcrusher",
    title: "Bitcrusher Arena",
    studio: "Chiptune Bruisers",
    tags: ["Action", "Rhythm", "Multiplayer"],
    pitch:
      "Four fighters, one beat. Land hits on-tempo or eat the bassline yourself.",
    art: { emoji: "🎛️", gradient: "linear-gradient(135deg, #2a0a2e, #ff3ad6)" },
    bounties: { click: 0.02, wishlist: 0.35, demo: 0.15, key: 0.6 },
    budgetTotal: 450,
    keysAvailable: 100,
    appeal: 0.9,
    listedDay: 12,
    dev: {
      location: "Manchester, UK",
      teamSize: 3,
      founded: 2023,
      bio: "Two fighting-game grinders and a chiptune producer who met at a jam. The netcode syncs to the beat grid, which they claim is a world first.",
    },
    reviews: [
      { author: "frame_perfect_fi", rating: 4, day: 13, text: "Whiffing off-beat and getting punished by a synth drop is a new kind of shame. Couch multiplayer is chaos incarnate." },
    ],
  },
  {
    id: "hollowharvest",
    title: "Hollow Harvest",
    studio: "Scarecrow Syndicate",
    tags: ["Horror", "Strategy", "Farming"],
    pitch:
      "Plant by day, defend by night. The corn grows better where something is buried.",
    art: { emoji: "🎃", gradient: "linear-gradient(135deg, #1f1206, #e07b1f)" },
    bounties: { click: 0.02, wishlist: 0.4, demo: 0.2, key: 0.75 },
    budgetTotal: 700,
    keysAvailable: 55,
    appeal: 1.1,
    listedDay: 8,
    dev: {
      location: "Des Moines, USA",
      teamSize: 4,
      founded: 2022,
      bio: "Four cousins who grew up on adjacent farms. They pitch the game as 'Stardew Valley after dark' and the trailer as 'a warning'.",
    },
    reviews: [
      { author: "combine_harvester", rating: 5, day: 10, text: "The day/night loop is perfect tension farming. My scarecrow moved and I have decided to trust it." },
      { author: "cornmaze_carl", rating: 4, day: 13, text: "Strategy layer is deeper than expected — sacrifice crops to feed the field or starve the thing under it. Choices!" },
    ],
  },
  {
    id: "tinytectonics",
    title: "Tiny Tectonics",
    studio: "Pebble Physics",
    tags: ["Puzzle", "Sandbox", "Geology"],
    pitch:
      "Squeeze continents, raise mountains, and split oceans on a planet the size of a marble.",
    art: { emoji: "🌋", gradient: "linear-gradient(135deg, #1c1214, #e0564f)" },
    bounties: { click: 0.02, wishlist: 0.35, demo: 0.15, key: 0.6 },
    budgetTotal: 500,
    keysAvailable: 75,
    appeal: 0.95,
    listedDay: 13,
    dev: {
      location: "Reykjavik, Iceland",
      teamSize: 2,
      founded: 2023,
      bio: "A volcanologist and her brother. The magma sim is her PhD model with the units changed and, in her words, 'the boring parts deleted'.",
    },
    reviews: [
      { author: "subduction_sue", rating: 5, day: 13, text: "Made a supercontinent, felt like a god, split it out of spite. Educational AND petty." },
    ],
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

// Which quests the rivals were already working when the demo starts.
export const RIVAL_CLAIMS = [
  ["priya", ["moonpetal", "deepseadiner", "bulletballet", "neongrimoire", "petalblade"]],
  ["carlos", ["moonpetal", "lighthouse", "clockworkbakery", "longferry"]],
  ["nina", ["gridrunner", "bulletballet", "bitcrusher", "voidcrawlers"]],
  ["ben", ["lighthouse", "channel13"]],
  ["sus99", ["gridrunner", "compostknights", "hollowharvest"]],
];
