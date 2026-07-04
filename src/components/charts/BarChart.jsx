// A single-series SVG bar chart. Each bar is its own hover target
// (full plot height, wider than the mark) with a tooltip readout.

import { useState } from "react";
import { niceTicks } from "./utils.js";

const W = 640;
const H = 200;
const PAD = { t: 16, r: 12, b: 28, l: 46 };

// 4px rounded top (data end), square at the baseline.
function barPath(x, y, w, h, r = 4) {
  if (h <= r) return `M${x},${y + h} v${-h} h${w} v${h} Z`;
  return `M${x},${y + h} v${-(h - r)} q0,${-r} ${r},${-r} h${w - 2 * r} q${r},0 ${r},${r} v${h - r} Z`;
}

export default function BarChart({
  data, // [{x, y}]
  color = "var(--chart-1)",
  formatX = (x) => `Day ${x}`,
  formatY = (v) => String(v),
}) {
  const [hoverI, setHoverI] = useState(null);
  if (!data || data.length === 0) return null;

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const ticks = niceTicks(Math.max(...data.map((d) => d.y), 1));
  const yMax = ticks[ticks.length - 1];
  const slot = plotW / data.length;
  const barW = Math.min(24, Math.max(2, slot - 2)); // ≤24px thick, 2px surface gap
  const ys = (y) => PAD.t + (1 - y / yMax) * plotH;

  const labelEvery = Math.ceil(data.length / 6);

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} onPointerLeave={() => setHoverI(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={ys(t)} y2={ys(t)}
              stroke="var(--chart-grid)" strokeWidth="1" />
            <text x={PAD.l - 8} y={ys(t) + 4} textAnchor="end" className="tick">
              {formatY(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const cx = PAD.l + i * slot + slot / 2;
          return (
            <g key={d.x}>
              {d.y > 0 && (
                <path
                  d={barPath(cx - barW / 2, ys(d.y), barW, ys(0) - ys(d.y))}
                  fill={color}
                  opacity={hoverI === null || hoverI === i ? 1 : 0.45}
                  style={
                    hoverI === i
                      ? { filter: `drop-shadow(0 0 4px ${color})` }
                      : undefined
                  }
                />
              )}
              {/* invisible full-height hit target, wider than the mark */}
              <rect
                x={PAD.l + i * slot} y={PAD.t} width={slot} height={plotH}
                fill="transparent"
                onPointerMove={() => setHoverI(i)}
              />
              {i % labelEvery === 0 && (
                <text x={cx} y={H - 8} textAnchor="middle" className="tick">
                  {formatX(d.x)}
                </text>
              )}
            </g>
          );
        })}
        <line x1={PAD.l} x2={W - PAD.r} y1={ys(0)} y2={ys(0)}
          stroke="var(--chart-baseline)" strokeWidth="1" />
      </svg>

      {hoverI !== null && (
        <div
          className="chart-tooltip"
          style={{
            left: `${((PAD.l + hoverI * slot + slot / 2) / W) * 100}%`,
            transform:
              (PAD.l + hoverI * slot) / W > 0.6
                ? "translateX(calc(-100% - 10px))"
                : "translateX(10px)",
          }}
        >
          <div className="tt-title">{formatX(data[hoverI].x)}</div>
          <div className="tt-row">
            <span className="tt-key" style={{ background: color }} />
            <strong>{formatY(data[hoverI].y)}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
