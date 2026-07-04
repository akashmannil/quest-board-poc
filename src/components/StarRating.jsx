// Pixel star rating. Renders `value` (0–5, may be fractional) as filled vs
// empty pixel stars. When `onRate` is passed it becomes an interactive input.

import { useState } from "react";
import PixelIcon from "./PixelIcon.jsx";

export default function StarRating({ value = 0, size = 14, onRate, count }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <span className={onRate ? "stars interactive" : "stars"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="star-slot"
          onMouseEnter={onRate ? () => setHover(n) : undefined}
          onMouseLeave={onRate ? () => setHover(0) : undefined}
          onClick={onRate ? () => onRate(n) : undefined}
          role={onRate ? "button" : undefined}
          aria-label={onRate ? `Rate ${n} of 5` : undefined}
        >
          <PixelIcon
            name="star"
            size={size}
            color={n <= Math.round(shown) ? "var(--neon-amber)" : "var(--surface-2)"}
          />
        </span>
      ))}
      {count != null && <span className="star-count">({count})</span>}
    </span>
  );
}
