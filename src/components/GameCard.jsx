// A compact, clickable game card used across the Discover homepage, the
// browse grid and the "related games" row. Clicking it opens the game page.
// `footer` lets each shelf show a different stat (heat, listing day, price…).

import { useNav } from "../state/Nav.jsx";
import { useApp } from "../state/AppState.jsx";
import { ratingSummary, isNew } from "../engine/discovery.js";
import Cover from "./Cover.jsx";
import StarRating from "./StarRating.jsx";
import PixelIcon from "./PixelIcon.jsx";

export default function GameCard({ game, footer, wide }) {
  const { openGame } = useNav();
  const { state } = useApp();
  const rating = ratingSummary(game);
  const fresh = isNew(game, state.day);

  return (
    <button
      className={wide ? "game-card wide" : "game-card"}
      onClick={() => openGame(game.id)}
    >
      <Cover
        game={game}
        height={wide ? 130 : 108}
        emojiSize={wide ? 56 : 46}
        badge={fresh ? "NEW" : null}
      />
      <div className="game-card-body">
        <div className="game-card-head">
          <h4>{game.title}</h4>
          <p className="game-card-studio">{game.studio}</p>
        </div>
        <div className="game-card-tags">
          {game.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="game-card-meta">
          {rating.count > 0 ? (
            <StarRating value={rating.avg} size={11} count={rating.count} />
          ) : (
            <span className="game-card-noreview">No reviews yet</span>
          )}
          {footer && <span className="game-card-footer">{footer}</span>}
        </div>
      </div>
    </button>
  );
}

// The footer stat helpers, so each shelf reads declaratively.
export function heatFooter(heat) {
  return (
    <span className="footer-heat">
      <PixelIcon name="flame" size={11} color="var(--neon-red)" /> {Math.round(heat)}
    </span>
  );
}

export function priceFooter(game) {
  return (
    <span className="footer-price">
      <PixelIcon name="star" size={11} color="var(--neon-green)" /> $
      {game.bounties.wishlist.toFixed(2)}
    </span>
  );
}
