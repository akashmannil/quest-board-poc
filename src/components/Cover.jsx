// The game's "box art": its gradient with the big emoji and the arcade-cabinet
// scanline wash. Shared by cards, shelves and the game page hero so the art
// looks identical everywhere.

export default function Cover({ game, height = 110, emojiSize = 52, badge }) {
  return (
    <div
      className="cover"
      style={{ background: game.art.gradient, height }}
    >
      <span className="cover-emoji" style={{ fontSize: emojiSize }}>
        {game.art.emoji}
      </span>
      {badge && <span className="cover-badge">{badge}</span>}
    </div>
  );
}
