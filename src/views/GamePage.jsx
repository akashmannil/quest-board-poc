// The game detail page. Commit 12 ships the core: back button, hero, the quest
// action panel (accept / tracked link / bounties / budget), and the rating
// summary. Commit 13 adds the stats chart, top promoters, dev card, reviews
// and related games below.

import { useApp } from "../state/AppState.jsx";
import { useNav } from "../state/Nav.jsx";
import { payoutMultiplier } from "../engine/exposure.js";
import { ratingSummary, isNew } from "../engine/discovery.js";
import Cover from "../components/Cover.jsx";
import StarRating from "../components/StarRating.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import { useState } from "react";

function QuestPanel({ game }) {
  const { state, dispatch } = useApp();
  const you = state.promoters.you;
  const [copied, setCopied] = useState(false);

  const budgetLeft = Math.max(0, game.budgetTotal - game.budgetSpent);
  const pctSpent = Math.min(100, (game.budgetSpent / game.budgetTotal) * 100);
  const closed = budgetLeft <= 0.5;
  const myClaim = state.claims.find(
    (c) => c.promoterId === "you" && c.gameId === game.id
  );
  const yourRate = game.bounties.wishlist * payoutMultiplier(you.score);

  return (
    <div className="card quest-panel">
      <h3>
        <PixelIcon name="sword" size={14} /> Take the quest
      </h3>
      <div className="quest-bounties">
        <span><PixelIcon name="star" size={14} /> ${game.bounties.wishlist.toFixed(2)}/wishlist</span>
        <span><PixelIcon name="download" size={14} /> ${game.bounties.demo.toFixed(2)}/demo</span>
        <span><PixelIcon name="key" size={14} /> ${game.bounties.key.toFixed(2)}/key</span>
      </div>
      <div className="quest-budget">
        <div className="quest-budget-bar">
          <div style={{ width: `${pctSpent}%` }} />
        </div>
        <span>
          ${budgetLeft.toFixed(0)} of ${game.budgetTotal} budget left ·{" "}
          {game.keysAvailable - game.keysUsed} keys in the pool
        </span>
      </div>

      {myClaim ? (
        <div className="quest-accepted">
          <p>
            <PixelIcon name="check" size={14} /> Quest accepted on day{" "}
            {myClaim.dayClaimed} — share your link:
          </p>
          <button
            className="quest-link"
            onClick={() => {
              navigator.clipboard?.writeText(`https://${myClaim.link}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            🔗 {copied ? "Copied!" : myClaim.link}
          </button>
        </div>
      ) : (
        <button
          className="btn-primary quest-accept"
          disabled={closed}
          onClick={() => dispatch({ type: "CLAIM_QUEST", gameId: game.id })}
        >
          {closed ? (
            "Quest closed — budget spent"
          ) : (
            <>
              <PixelIcon name="sword" size={13} /> Accept — earn ~${yourRate.toFixed(2)}/wishlist
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function GamePage() {
  const { state } = useApp();
  const { route, go } = useNav();
  const game = state.games[route.gameId];

  if (!game) {
    return (
      <div className="empty-note">
        That game isn't listed.{" "}
        <button className="linklike" onClick={() => go("discover")}>
          Back to Discover
        </button>
      </div>
    );
  }

  const rating = ratingSummary(game);

  return (
    <section className="game-page">
      <button className="back-btn" onClick={() => go("discover")}>
        ← Back to Discover
      </button>

      <div className="game-hero">
        <Cover
          game={game}
          height={220}
          emojiSize={100}
          badge={isNew(game, state.day) ? "NEW" : null}
        />
        <div className="game-hero-body">
          <h2 className="game-hero-title">{game.title}</h2>
          <p className="game-hero-studio">
            by {game.studio} · {game.dev.location}
          </p>
          <div className="hero-tags">
            {game.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <p className="game-hero-pitch">{game.pitch}</p>
          <div className="game-hero-rating">
            {rating.count > 0 ? (
              <StarRating value={rating.avg} size={15} count={rating.count} />
            ) : (
              <span className="game-card-noreview">No reviews yet — be the first below.</span>
            )}
          </div>
        </div>
      </div>

      <QuestPanel game={game} />
    </section>
  );
}
