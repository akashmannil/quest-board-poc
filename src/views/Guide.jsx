// The Player's Guide — QuestBoard's instruction manual, written like the
// booklet that came in an old game box. One rule keeps it honest: every
// number on this page (score weights, tier thresholds, multipliers, the
// settlement window) is imported from the exposure engine and rendered live,
// so the manual can never drift from the game it describes.

import { useApp } from "../state/AppState.jsx";
import { useNav } from "../state/Nav.jsx";
import {
  EVENT_TYPES,
  TIERS,
  MIN_MULT,
  MAX_MULT,
  SETTLEMENT_DAYS,
  STREAK_BONUS_PER_DAY,
  STREAK_BONUS_CAP,
  DAILY_DECAY,
  DAILY_GAIN_CAP,
  payoutMultiplier,
} from "../engine/exposure.js";
import PixelIcon, { TIER_ICONS, OUTCOME_ICONS } from "../components/PixelIcon.jsx";

// The five screens, described from the player's chair. `view` powers the
// jump button so the manual can teleport you to the thing it's explaining.
const SCREENS = [
  {
    view: "discover",
    icon: "gem",
    name: "Discover",
    blurb:
      "The storefront. Games ranked by heat, taste and momentum so the good ones surface instead of drowning in a list.",
  },
  {
    view: "board",
    icon: "map",
    name: "Quest Board",
    blurb:
      "The job board. Every game is a bounty-funded quest — accept one and it mints your tracked link.",
  },
  {
    view: "promoter",
    icon: "chart",
    name: "My Dashboard",
    blurb:
      "Your side of the ledger: score, tier, streak, daily earnings, and where you sit on the payout curve.",
  },
  {
    view: "dev",
    icon: "gamepad",
    name: "Dev HQ",
    blurb:
      "The developer's receipt: budget spent, cost per wishlist, and exactly which promoter delivered what.",
  },
  {
    view: "trust",
    icon: "shield",
    name: "Trust & Safety",
    blurb:
      "The immune system. The live defenses — and the log of the bot they catch, every single run.",
  },
];

const fmtMult = (score) => `${payoutMultiplier(score).toFixed(2)}×`;

export default function Guide({ onReplayIntro }) {
  const { state } = useApp();
  const { go } = useNav();
  const gameCount = Object.keys(state.games).length;

  return (
    <section className="guide">
      <div className="view-intro">
        <h2>
          <PixelIcon name="book" size={18} /> Player's Guide
        </h2>
        <p>
          The manual for QuestBoard — what it is, why it exists, and how a run
          plays out. Short version: devs pay for outcomes instead of ads,
          anyone can be the marketing, and honest work compounds.
        </p>
      </div>

      {/* -------- why this exists -------- */}
      <div className="guide-cols">
        <div className="card guide-card">
          <h3>
            <PixelIcon name="skull" size={14} /> The problem
          </h3>
          <p>
            Roughly 19,000 games launch on Steam every year. Storefront
            visibility feeds on wishlists a game doesn't have yet, and paid
            marketing costs more than most indie budgets. Indie devs don't
            fail at making games — they fail at getting <em>seen</em>.
          </p>
        </div>
        <div className="card guide-card">
          <h3>
            <PixelIcon name="bolt" size={14} /> The bet
          </h3>
          <p>
            Flip the ad budget into bounties. A dev lists their game as a
            quest — say, $0.45 per verified wishlist — and pays only when a
            real person acts. On the other side, <em>anyone</em> can promote:
            a streamer, a group-chat enthusiast, a total beginner with zero
            followers. The platform's job is to make honest hustle pay.
          </p>
        </div>
      </div>

      {/* -------- how a run plays -------- */}
      <div className="card guide-card">
        <h3>
          <PixelIcon name="sword" size={14} /> How a run plays
        </h3>
        <ol className="guide-steps">
          <li>
            <span className="guide-step-num">01</span>
            <p>
              <strong>Pick a quest.</strong> Browse the {gameCount} games on
              Discover or the Quest Board and find one you'd actually vouch
              for. Every quest shows its bounties and how much budget is left.
            </p>
          </li>
          <li>
            <span className="guide-step-num">02</span>
            <p>
              <strong>Accept it, get your link.</strong> Accepting mints a
              unique tracked link. Everything that link causes is attributed
              to you — and only outcomes count, never raw activity.
            </p>
          </li>
          <li>
            <span className="guide-step-num">03</span>
            <p>
              <strong>Outcomes land.</strong> Clicks barely register; verified
              wishlists, demo downloads and key redemptions are the loot. Each
              one earns money <em>and</em> feeds your Exposure Score.
            </p>
          </li>
          <li>
            <span className="guide-step-num">04</span>
            <p>
              <strong>Money waits {SETTLEMENT_DAYS} days.</strong> Earnings
              sit as <em>pending</em> through a {SETTLEMENT_DAYS}-day fraud
              window before they settle. Fake traffic gets voided in that
              window at zero cost — the money never left.
            </p>
          </li>
          <li>
            <span className="guide-step-num">05</span>
            <p>
              <strong>Level up, earn more.</strong> Payout = bounty × your
              multiplier. The same wishlist that pays a newcomer{" "}
              {fmtMult(0)} of bounty pays a Legend up to {MAX_MULT}× — the
              whole economy is in that curve.
            </p>
          </li>
        </ol>
      </div>

      {/* -------- the exposure score -------- */}
      <div className="card guide-card">
        <h3>
          <PixelIcon name="star" size={14} /> Your XP: the Exposure Score
        </h3>
        <p className="guide-formula">payout = bounty × multiplier(score)</p>
        <div className="guide-cols guide-mechanics">
          <div className="guide-mech">
            <h4>
              <PixelIcon name="check" size={12} /> Only outcomes score
            </h4>
            <ul className="guide-weights">
              {Object.entries(EVENT_TYPES).map(([type, ev]) => (
                <li key={type}>
                  <PixelIcon name={OUTCOME_ICONS[type]} size={12} />
                  <span>{ev.label}</span>
                  <b>+{ev.scoreGain}</b>
                </li>
              ))}
            </ul>
            <p>Posting a lot earns nothing. Posts that convert do.</p>
          </div>
          <div className="guide-mech">
            <h4>
              <PixelIcon name="flame" size={12} /> Streaks compound
            </h4>
            <p>
              Every consecutive active day adds +{STREAK_BONUS_PER_DAY * 100}%
              to that day's score gains, up to {STREAK_BONUS_CAP}×. Showing up
              daily is the strongest move in the game.
            </p>
          </div>
          <div className="guide-mech">
            <h4>
              <PixelIcon name="bolt" size={12} /> No overnight rockets
            </h4>
            <p>
              Score gains soft-cap at {DAILY_GAIN_CAP} points a day. No burst
              of traffic — real or purchased — can skip the climb; reputation
              is earned over weeks, not bought in a night.
            </p>
          </div>
          <div className="guide-mech">
            <h4>
              <PixelIcon name="hourglass" size={12} /> Silence rusts
            </h4>
            <p>
              Every quiet day shaves {(DAILY_DECAY * 100).toFixed(1)}% off
              your score — a month of nothing costs about 17%. Nobody squats
              on old glory.
            </p>
          </div>
        </div>

        <h4 className="guide-ladder-title">
          <PixelIcon name="crown" size={12} /> The tier ladder
        </h4>
        <p className="chart-sub">
          Tiers are labels over the continuous curve — the multiplier shown is
          what the tier's doorstep score pays.
        </p>
        <div className="tier-ladder">
          {TIERS.map((t) => (
            <div className="tier-rung" key={t.name}>
              <PixelIcon name={TIER_ICONS[t.name]} size={14} color={t.color} />
              <span className="tier-rung-name" style={{ color: t.color }}>
                {t.name}
              </span>
              <span className="tier-rung-score">score {t.min}+</span>
              <b className="tier-rung-mult">{fmtMult(t.min)}</b>
            </div>
          ))}
        </div>
        <p className="guide-fineprint">
          The curve is an S: flat start ({MIN_MULT}×), steep middle, hard
          ceiling ({MAX_MULT}×) — so newcomers earn from day one, growth feels
          exponential while you're proving yourself, and the top 1% can't eat
          the whole market.
        </p>
      </div>

      {/* -------- the screens -------- */}
      <div className="card guide-card">
        <h3>
          <PixelIcon name="map" size={14} /> The screens
        </h3>
        <div className="screen-map">
          {SCREENS.map((s) => (
            <button key={s.view} className="screen-row" onClick={() => go(s.view)}>
              <PixelIcon name={s.icon} size={16} color="var(--neon-cyan)" />
              <span className="screen-row-body">
                <span className="screen-row-name">{s.name}</span>
                <span className="screen-row-blurb">{s.blurb}</span>
              </span>
              <span className="screen-row-go">GO →</span>
            </button>
          ))}
        </div>
        <p className="guide-fineprint">
          Every game also has its own page — wishlist chart, reviews you can
          add to, the devs behind it, and the quest panel. Click any cover to
          get there.
        </p>
      </div>

      {/* -------- time controls + honesty -------- */}
      <div className="guide-cols">
        <div className="card guide-card">
          <h3>
            <PixelIcon name="hourglass" size={14} /> Time is a button
          </h3>
          <p>
            There's no real internet behind this demo, so the top bar hands
            you the clock. <b>⏭ Advance day</b> simulates one day of traffic —
            clicks, wishlists, earnings, everything. <b>▶ Autoplay</b> runs
            days on its own; <b>↺ Reset</b> rewinds the world to day 14.
          </p>
          <p>
            The simulation is seeded, so every reset replays the same movie —
            down to the day the fraud bot gets caught. Nothing here is
            hand-waved: the numbers you watch are the engine actually running.
          </p>
        </div>
        <div className="card guide-card">
          <h3>
            <PixelIcon name="heart" size={14} /> What's real, what's pretend
          </h3>
          <p>
            This is a proof of concept, and it doesn't pretend otherwise. No
            backend, no accounts, no real payments — the traffic is invented
            by a seeded simulator in your browser. Steam has no affiliate
            program, so a production version would verify wishlists through
            UTM analytics instead of tracked bounty links.
          </p>
          <p>
            The fraud detection is one honest heuristic, not a security
            product — <button className="linklike" onClick={() => go("trust")}>
            Trust &amp; Safety</button> lists exactly what production would
            still need.
          </p>
        </div>
      </div>

      {onReplayIntro && (
        <div className="guide-replay">
          <button className="btn-toggle" onClick={onReplayIntro}>
            ▶ Replay the intro
          </button>
        </div>
      )}
    </section>
  );
}
