// The QuestBoard mark: a pixel-art shield (magenta) with a sword (cyan)
// driven diagonally through it. Drawn as a 12×12 pixel map where each
// character picks a color.

const MAP = [
  ".PPPPPPPPPPC",
  ".PPPPPPPPPC.",
  ".PPPPPPPPCP.",
  ".PPPPPPPCPP.",
  ".PPPPPPCPPP.",
  "..PPPPCPPP..",
  "..PPPCPPPP..",
  "...PCPPPP...",
  "...CPPPP....",
  ".CCC.PP.....",
  ".CC.........",
  "C...........",
];

const COLORS = { P: "var(--neon-pink)", C: "var(--neon-cyan)" };

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="logo-mark"
      aria-hidden="true"
    >
      {MAP.flatMap((row, y) =>
        [...row].map((ch, x) =>
          COLORS[ch] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[ch]} />
          ) : null
        )
      )}
    </svg>
  );
}
