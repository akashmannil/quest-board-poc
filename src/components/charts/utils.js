// Small shared helpers for the hand-rolled SVG charts.

// Clean axis ticks: 0 / 50 / 100 instead of 0 / 47.3 / 94.6.
export function niceTicks(maxVal, count = 4) {
  if (maxVal <= 0) return [0, 1];
  const rough = maxVal / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const ticks = [];
  for (let v = 0; v <= maxVal + step * 0.001; v += step) ticks.push(+v.toFixed(6));
  return ticks;
}

export const fmtMoney = (v) => `$${v.toFixed(2)}`;
export const fmtNum = (v) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v * 10) / 10}`;
