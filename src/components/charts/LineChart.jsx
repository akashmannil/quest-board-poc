// A single-series SVG line chart with the standard hover layer:
// a vertical crosshair snaps to the nearest data point and a tooltip
// reads out the value there (plus any annotation dots nearby).

import { useRef, useState } from "react";
import { niceTicks } from "./utils.js";

const W = 640;
const H = 240;
const PAD = { t: 16, r: 20, b: 28, l: 46 };

export default function LineChart({
  data, // [{x, y}] sorted by x
  color = "var(--chart-1)",
  formatX = (x) => `Day ${x}`,
  formatY = (v) => String(Math.round(v)),
  refLines = [], // horizontal guides: [{y, label}]
  dots = [], // annotation dots: [{x, y, label, color, showLabel}]
  endLabel, // direct label on the last point
}) {
  const ref = useRef(null);
  const [hoverI, setHoverI] = useState(null);

  if (!data || data.length < 2) return null;

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const xMin = data[0].x;
  const xMax = data[data.length - 1].x;
  // Scale to the data, not the reference lines: a newcomer's score chart
  // should not be flattened by the "Legend: 900" threshold. Guides that are
  // out of range simply don't render yet — they appear as you approach them.
  const yTop = Math.max(...data.map((d) => d.y), ...dots.map((d) => d.y), 1);
  const ticks = niceTicks(yTop);
  const yMax = ticks[ticks.length - 1];
  const visibleRefLines = refLines.filter((r) => r.y <= yMax);

  const xs = (x) => PAD.l + ((x - xMin) / (xMax - xMin || 1)) * plotW;
  const ys = (y) => PAD.t + (1 - y / yMax) * plotH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${xs(d.x).toFixed(1)},${ys(d.y).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${xs(xMax).toFixed(1)},${PAD.t + plotH} L${PAD.l},${PAD.t + plotH} Z`;

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const xVal = xMin + ((px - PAD.l) / plotW) * (xMax - xMin);
    let best = 0;
    let bestDist = Infinity;
    data.forEach((d, i) => {
      const dist = Math.abs(d.x - xVal);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setHoverI(best);
  }

  const hover = hoverI == null ? null : data[hoverI];
  // annotation dots close to the crosshair join the readout
  const nearDots = hover
    ? dots.filter((d) => Math.abs(d.x - hover.x) <= (xMax - xMin) / 30)
    : [];

  const xTicks = niceTicks(xMax - xMin, 5)
    .map((t) => xMin + t)
    .filter((t) => t <= xMax);

  return (
    <div className="chart-wrap" ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHoverI(null)}
      >
        {/* gridlines + y ticks */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l} x2={W - PAD.r} y1={ys(t)} y2={ys(t)}
              stroke="var(--chart-grid)" strokeWidth="1"
            />
            <text x={PAD.l - 8} y={ys(t) + 4} textAnchor="end" className="tick">
              {formatY(t)}
            </text>
          </g>
        ))}
        {/* x ticks */}
        {xTicks.map((t) => (
          <text key={t} x={xs(t)} y={H - 8} textAnchor="middle" className="tick">
            {formatX(t)}
          </text>
        ))}
        {/* reference lines */}
        {visibleRefLines.map((r) => (
          <g key={r.label}>
            <line
              x1={PAD.l} x2={W - PAD.r} y1={ys(r.y)} y2={ys(r.y)}
              stroke="var(--chart-baseline)" strokeWidth="1"
            />
            <text x={W - PAD.r} y={ys(r.y) - 4} textAnchor="end" className="tick faint">
              {r.label}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={color} opacity="0.1" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round" />

        {/* annotation dots (with a surface ring so they read over the line) */}
        {dots.map((d) => (
          <g key={d.label}>
            <circle cx={xs(d.x)} cy={ys(d.y)} r="5" fill={d.color}
              stroke="var(--surface)" strokeWidth="2" />
            {d.showLabel && (
              <text x={xs(d.x)} y={ys(d.y) - 10} textAnchor="middle" className="dot-label">
                {d.label}
              </text>
            )}
          </g>
        ))}

        {/* end dot + direct label on the latest value */}
        <circle cx={xs(xMax)} cy={ys(data[data.length - 1].y)} r="4.5"
          fill={color} stroke="var(--surface)" strokeWidth="2" />
        {endLabel && (
          <text x={xs(xMax) - 8} y={ys(data[data.length - 1].y) - 10}
            textAnchor="end" className="dot-label">
            {endLabel}
          </text>
        )}

        {/* crosshair */}
        {hover && (
          <line
            x1={xs(hover.x)} x2={xs(hover.x)} y1={PAD.t} y2={PAD.t + plotH}
            stroke="var(--text-faint)" strokeWidth="1"
          />
        )}
      </svg>

      {hover && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(xs(hover.x) / W) * 100}%`,
            transform: xs(hover.x) / W > 0.6 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
          }}
        >
          <div className="tt-title">{formatX(hover.x)}</div>
          <div className="tt-row">
            <span className="tt-key" style={{ background: color }} />
            <strong>{formatY(hover.y)}</strong>
          </div>
          {nearDots.map((d) => (
            <div className="tt-row" key={d.label}>
              <span className="tt-key" style={{ background: d.color }} />
              <strong>{formatY(d.y)}</strong>
              <span className="tt-label">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
