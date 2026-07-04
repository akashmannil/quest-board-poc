// The game detail page. A storefront page for a single game: hero, the quest
// action panel, a wishlists-over-time chart, who's promoting it, the developer
// behind it, player reviews (readable + writable), and related games.

import { useState } from "react";
import { useApp } from "../state/AppState.jsx";
import { useNav } from "../state/Nav.jsx";
import { payoutMultiplier } from "../engine/exposure.js";
import {
  ratingSummary,
  isNew,
  relatedGames,
  topPromotersFor,
  heatScore,
} from "../engine/discovery.js";
import Cover from "../components/Cover.jsx";
import StarRating from "../components/StarRating.jsx";
import PixelIcon from "../components/PixelIcon.jsx";
import GameCard, { heatFooter } from "../components/GameCard.jsx";
import BarChart from "../components/charts/BarChart.jsx";
import { fmtMoney } from "../components/charts/utils.js";

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
            <PixelIcon name="check" size={14} /> Accepted on day {myClaim.dayClaimed} — your link:
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

function DevCard({ game }) {
  const { dev } = game;
  return (
    <div className="card dev-card">
      <h3>
        <PixelIcon name="gamepad" size={14} /> The developer
      </h3>
      <p className="dev-studio">{game.studio}</p>
      <div className="dev-facts">
        <span>📍 {dev.location}</span>
        <span>
          <PixelIcon name="heart" size={12} color="var(--neon-pink)" />{" "}
          {dev.teamSize} {dev.teamSize === 1 ? "person" : "people"}
        </span>
        <span>🗓 since {dev.founded}</span>
      </div>
      <p className="dev-bio">{dev.bio}</p>
    </div>
  );
}

function TopPromoters({ game }) {
  const { state } = useApp();
  const rows = topPromotersFor(state, game.id, 5);
  return (
    <div className="card">
      <h3>
        <PixelIcon name="crown" size={14} /> Top promoters
      </h3>
      {rows.length === 0 ? (
        <p className="empty-note">No promoters have driven outcomes yet.</p>
      ) : (
        <ul className="promoter-list">
          {rows.map((r, i) => (
            <li key={r.promoter.id} className={r.promoter.isPlayer ? "is-you" : ""}>
              <span className="promoter-rank">{i + 1}</span>
              <span className="promoter-av">{r.promoter.avatar}</span>
              <span className="promoter-info">
                <strong>{r.promoter.name}</strong>
                <span className="cell-sub">{r.promoter.channel}</span>
              </span>
              <span className="promoter-wl">
                <PixelIcon name="star" size={11} color="var(--neon-amber)" />{" "}
                {r.wishlists.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatsCard({ game }) {
  const data = game.dailyStats
    .slice(-30)
    .map((d) => ({ x: d.day, y: d.wishlists }));
  const totalSpend = game.dailyStats.reduce((a, d) => a + d.spend, 0);

  return (
    <div className="card chart-card">
      <h3>
        <PixelIcon name="chart" size={14} /> Wishlists per day
      </h3>
      <p className="chart-sub">
        {game.totals.wishlist.toLocaleString()} wishlists ·{" "}
        {game.totals.demo.toLocaleString()} demos · {game.totals.key} keys ·{" "}
        {fmtMoney(totalSpend)} paid out to promoters
      </p>
      {data.length > 0 ? (
        <BarChart data={data} color="var(--chart-2)" formatY={(v) => String(Math.round(v))} />
      ) : (
        <p className="empty-note">No traffic yet — advance a few days.</p>
      )}
    </div>
  );
}

function ReviewsSection({ game }) {
  const { dispatch } = useApp();
  const rating = ratingSummary(game);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const alreadyReviewed = game.reviews.some((r) => r.author === "you");

  const submit = () => {
    if (!stars || !text.trim()) return;
    dispatch({ type: "POST_REVIEW", gameId: game.id, review: { rating: stars, text } });
    setStars(0);
    setText("");
  };

  return (
    <div className="card reviews-card">
      <h3>
        <PixelIcon name="star" size={14} /> Player reviews
      </h3>
      <div className="reviews-summary">
        {rating.count > 0 ? (
          <>
            <span className="reviews-avg">{rating.avg.toFixed(1)}</span>
            <StarRating value={rating.avg} size={15} />
            <span className="cell-sub">
              {rating.count} review{rating.count === 1 ? "" : "s"}
            </span>
          </>
        ) : (
          <span className="empty-note">No reviews yet — be the first.</span>
        )}
      </div>

      {!alreadyReviewed && (
        <div className="review-form">
          <div className="review-form-head">
            <span className="control-label">Your rating</span>
            <StarRating value={stars} size={18} onRate={setStars} />
          </div>
          <textarea
            className="review-input"
            placeholder="Share what you thought of this game…"
            value={text}
            maxLength={280}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="review-form-foot">
            <span className="cell-sub">{text.length}/280</span>
            <button
              className="btn-primary"
              disabled={!stars || !text.trim()}
              onClick={submit}
            >
              Post review
            </button>
          </div>
        </div>
      )}

      <ul className="review-list">
        {game.reviews.map((r) => (
          <li key={r.id} className={r.author === "you" ? "review is-you" : "review"}>
            <div className="review-head">
              <span className="review-author">
                {r.author === "you" ? "🫵 You" : `@${r.author}`}
              </span>
              <StarRating value={r.rating} size={12} />
              <span className="review-day">day {r.day}</span>
            </div>
            <p className="review-text">{r.text}</p>
          </li>
        ))}
      </ul>
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
  const related = relatedGames(state, game.id, 4);

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
            <span className="hero-heat">
              <PixelIcon name="flame" size={12} color="var(--neon-red)" /> heat{" "}
              {Math.round(heatScore(state, game))}
            </span>
          </div>
        </div>
      </div>

      <div className="game-layout">
        <div className="game-main">
          <StatsCard game={game} />
          <ReviewsSection game={game} />
        </div>
        <div className="game-side">
          <QuestPanel game={game} />
          <DevCard game={game} />
          <TopPromoters game={game} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="shelf related-shelf">
          <div className="shelf-head">
            <h3>
              <PixelIcon name="gem" size={14} /> Related games
            </h3>
            <p className="shelf-sub">Shares genres with {game.title}.</p>
          </div>
          <div className="shelf-row">
            {related.map((g) => (
              <GameCard key={g.id} game={g} footer={heatFooter(heatScore(state, g))} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
