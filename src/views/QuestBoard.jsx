// The marketplace: every indie game is a "quest" a promoter can accept.
// Accepting one generates the unique tracked link that attributes every
// click / wishlist / key back to this promoter.

import { useState } from "react";
import { useApp } from "../state/AppState.jsx";
import { payoutMultiplier } from "../engine/exposure.js";

function CopyLink({ link }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="quest-link"
      title="Copy your tracked link"
      onClick={() => {
        navigator.clipboard?.writeText(`https://${link}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      🔗 {copied ? "Copied!" : link}
    </button>
  );
}

function QuestCard({ game }) {
  const { state, dispatch } = useApp();
  const you = state.promoters.you;

  const budgetLeft = Math.max(0, game.budgetTotal - game.budgetSpent);
  const pctSpent = Math.min(100, (game.budgetSpent / game.budgetTotal) * 100);
  const closed = budgetLeft <= 0.5;

  const hunters = state.claims.filter((c) => c.gameId === game.id);
  const myClaim = hunters.find((c) => c.promoterId === "you");

  // What one wishlist pays *you*, at your current score.
  const yourRate = game.bounties.wishlist * payoutMultiplier(you.score);

  return (
    <article className={closed ? "quest-card closed" : "quest-card"}>
      <div className="quest-art" style={{ background: game.art.gradient }}>
        <span className="quest-emoji">{game.art.emoji}</span>
        {closed && <span className="quest-closed-badge">Budget spent — quest closed</span>}
      </div>

      <div className="quest-body">
        <header>
          <h3>{game.title}</h3>
          <p className="quest-studio">{game.studio}</p>
        </header>

        <div className="quest-tags">
          {game.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <p className="quest-pitch">{game.pitch}</p>

        <div className="quest-bounties">
          <span title="Per verified Steam wishlist">⭐ ${game.bounties.wishlist.toFixed(2)}/wishlist</span>
          <span title="Per demo download">⬇️ ${game.bounties.demo.toFixed(2)}/demo</span>
          <span title="Per game key redeemed">🔑 ${game.bounties.key.toFixed(2)}/key</span>
        </div>

        <div className="quest-budget">
          <div className="quest-budget-bar">
            <div style={{ width: `${pctSpent}%` }} />
          </div>
          <span>
            ${budgetLeft.toFixed(0)} of ${game.budgetTotal} budget left ·{" "}
            {game.totals.wishlist.toLocaleString()} wishlists so far
          </span>
        </div>

        <div className="quest-hunters">
          {hunters.map((c) => (
            <span key={c.id} title={state.promoters[c.promoterId].name}>
              {state.promoters[c.promoterId].avatar}
            </span>
          ))}
          <span className="quest-hunters-label">
            {hunters.length} promoter{hunters.length === 1 ? "" : "s"} on this quest
          </span>
        </div>

        {myClaim ? (
          <div className="quest-accepted">
            <p>✅ Quest accepted on day {myClaim.dayClaimed} — share your link:</p>
            <CopyLink link={myClaim.link} />
          </div>
        ) : (
          <button
            className="btn-primary quest-accept"
            disabled={closed}
            onClick={() => dispatch({ type: "CLAIM_QUEST", gameId: game.id })}
          >
            {closed
              ? "Quest closed"
              : `Accept quest — earn ~$${yourRate.toFixed(2)}/wishlist at your score`}
          </button>
        )}
      </div>
    </article>
  );
}

export default function QuestBoard() {
  const { state } = useApp();
  return (
    <section>
      <div className="view-intro">
        <h2>🗺️ Quest Board</h2>
        <p>
          Indie devs fund quests with outcome bounties instead of upfront ad
          spend. Accept a quest, share your tracked link anywhere, and earn for
          every <strong>verified</strong> wishlist, demo and key it produces.
        </p>
      </div>
      <div className="quest-grid">
        {Object.values(state.games).map((g) => (
          <QuestCard key={g.id} game={g} />
        ))}
      </div>
    </section>
  );
}
