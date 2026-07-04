// Hand-drawn 8×8 pixel-art icons, rendered as SVG squares — the game-like
// icon language of the redesign. 'X' = a filled pixel; icons inherit their
// color from the surrounding text (currentColor) unless told otherwise.

const ICONS = {
  sword: [
    "...XX...",
    "...XX...",
    "...XX...",
    "...XX...",
    ".XXXXXX.",
    "...XX...",
    "...XX...",
    "..XXXX..",
  ],
  map: [
    "XXXXXXXX",
    "X......X",
    "X.XX...X",
    "X...X..X",
    "X....X.X",
    "X..XX..X",
    "X......X",
    "XXXXXXXX",
  ],
  chart: [
    "........",
    ".......X",
    "....X..X",
    "....X..X",
    ".X..X..X",
    ".X..X..X",
    ".X..X..X",
    "XXXXXXXX",
  ],
  gamepad: [
    "........",
    ".XXXXXX.",
    "XXXXXXXX",
    "X..XX..X",
    "XXXXXXXX",
    "XXX..XXX",
    "XX....XX",
    "........",
  ],
  shield: [
    "XXXXXXXX",
    "XXXXXXXX",
    "XXX..XXX",
    "XXX..XXX",
    ".XXXXXX.",
    ".XXXXXX.",
    "..XXXX..",
    "...XX...",
  ],
  coin: [
    "..XXXX..",
    ".X....X.",
    "X..XX..X",
    "X.X....X",
    "X.X....X",
    "X..XX..X",
    ".X....X.",
    "..XXXX..",
  ],
  star: [
    "...XX...",
    "...XX...",
    "..XXXX..",
    "XXXXXXXX",
    ".XXXXXX.",
    "..XXXX..",
    ".XX..XX.",
    "XX....XX",
  ],
  key: [
    "..XXXX..",
    ".XX..XX.",
    ".XX..XX.",
    "..XXXX..",
    "...XX...",
    "...XX.X.",
    "...XX...",
    "...XXXX.",
  ],
  heart: [
    ".XX..XX.",
    "XXXXXXXX",
    "XXXXXXXX",
    "XXXXXXXX",
    ".XXXXXX.",
    "..XXXX..",
    "...XX...",
    "........",
  ],
  flame: [
    "...X....",
    "...XX...",
    "..XXX...",
    "..XXXX..",
    ".XXXXXX.",
    ".XXXXXX.",
    "..XXXX..",
    "........",
  ],
  crown: [
    "........",
    "X..XX..X",
    "X..XX..X",
    "XXXXXXXX",
    "XXXXXXXX",
    ".XXXXXX.",
    ".XXXXXX.",
    "........",
  ],
  gem: [
    "........",
    ".XXXXXX.",
    "XXXXXXXX",
    ".XXXXXX.",
    "..XXXX..",
    "...XX...",
    "........",
    "........",
  ],
  bolt: [
    "...XXX..",
    "..XXX...",
    ".XXXXXX.",
    "...XXX..",
    "..XXX...",
    ".XXX....",
    "XXX.....",
    "XX......",
  ],
  rocket: [
    "...XX...",
    "..XXXX..",
    "..XXXX..",
    "..X..X..",
    "..XXXX..",
    "..XXXX..",
    ".XXXXXX.",
    ".X.XX.X.",
  ],
  sprout: [
    ".XX..XX.",
    ".XXX.XXX",
    "..XX.XX.",
    "...XX...",
    "...XX...",
    "..XXXX..",
    ".XXXXXX.",
    "........",
  ],
  hourglass: [
    "XXXXXXXX",
    ".X....X.",
    "..X..X..",
    "...XX...",
    "...XX...",
    "..X.XX..",
    ".X..XXX.",
    "XXXXXXXX",
  ],
  check: [
    "........",
    "......XX",
    ".....XXX",
    "XX..XXX.",
    "XXXXXX..",
    ".XXXX...",
    "..XX....",
    "........",
  ],
  skull: [
    ".XXXXXX.",
    "XXXXXXXX",
    "X..XX..X",
    "XXX..XXX",
    "XXXXXXXX",
    ".XXXXXX.",
    ".X.XX.X.",
    "........",
  ],
  pickaxe: [
    "..XXXXX.",
    ".XX...XX",
    "X....XX.",
    "....XX.X",
    "...XX...",
    "..XX....",
    ".XX.....",
    "XX......",
  ],
};

export default function PixelIcon({ name, size = 16, color = "currentColor", className }) {
  const map = ICONS[name];
  if (!map) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${map[0].length} ${map.length}`}
      shapeRendering="crispEdges"
      className={className ? `px-icon ${className}` : "px-icon"}
      aria-hidden="true"
    >
      {map.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "X" ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}
