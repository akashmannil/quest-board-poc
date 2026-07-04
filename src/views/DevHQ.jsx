// The developer's side of the marketplace: pick one of the seeded games and
// see exactly what its outcome-bounty budget bought — and from whom.
// Deliberately thinner than the promoter dashboard: the promoter side is the
// novel part of the platform; this side answers the dev's one question,
// "was my money worth it?"

import { useState } from "react";
import { useApp } from "../state/AppState.jsx";
import BarChart from "../components/charts/BarChart.jsx";
import { fmtMoney } from "../components/charts/utils.js";
import PixelIcon from "../components/PixelIcon.jsx";

// Everything the dev of `gameId` paid, grouped by promoter.
function attribution(state, gameId) {
  const rows = [];
  for (const claim of state.claims.filter((c) => c.gameId === gameId)) {
    const entries = state.ledger.filter(
      (e) => e.claimId === claim.id && !e.voided
    );
    const voided = state.ledger.filter(
      (e) => e.claimId === claim.id && e.voided
    );
    rows.push({
      promoter: state.promoters[claim.promoterId],
      totals: claim.totals,
      cost: entries.reduce((a, e) => a + e.devCost, 0),
      voidedCost: voided.reduce((a, e) => a + e.devCost, 0),
    });
  }
  return rows.sort((a, b) => b.totals.wishlist - a.totals.wishlist);
}

export default function DevHQ() {
  const { state } = useApp();
  const games = Object.values(state.games);
  const [gameId, setGameId] = useState(games[0].id);
  const game = state.games[gameId];

  const rows = attribution(state, gameId);
  const totalCost = rows.reduce((a, r) => a + r.cost, 0);
  const costPerWishlist =
    game.totals.wishlist > 0 ? totalCost / game.totals.wishlist : 0;
  const maxWl = Math.max(...rows.map((r) => r.totals.wishlist), 1);

  const wishlistsByDay = game.dailyStats
    .slice(-30)
    .map((d) => ({ x: d.day, y: d.wishlists }));

  return (
    <section>
      <div className="view-intro">
        <h2>
          <PixelIcon name="gamepad" size={18} /> Dev HQ
        </h2>
        <p>
          The developer's view: no upfront ad spend, no agency retainer — the
          budget only moves when a <strong>verified outcome</strong> happens,
          and every dollar is attributed to the promoter who caused it.
        </p>
      </div>

      <div className="game-picker">
        {games.map((g) => (
          <button
            key={g.id}
            className={g.id === gameId ? "active" : ""}
            onClick={() => setGameId(g.id)}
          >
            {g.art.emoji} {g.title}
          </button>
        ))}
      </div>

      <div className="stat-row">
        <div className="stat-tile">
          <p className="stat-label"><PixelIcon name="coin" size={12} /> Budget</p>
          <p className="stat-value">{fmtMoney(game.budgetSpent)}</p>
          <p className="stat-sub">
            spent of ${game.budgetTotal}
            {game.budgetTotal - game.budgetSpent <= 0.5 && " — campaign complete"}
          </p>
        </div>
        <div className="stat-tile">
          <p className="stat-label"><PixelIcon name="star" size={12} /> Wishlists bought</p>
          <p className="stat-value">{game.totals.wishlist.toLocaleString()}</p>
          <p className="stat-sub">the metric Steam's algorithm rewards</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label"><PixelIcon name="pickaxe" size={12} /> Cost per wishlist</p>
          <p className="stat-value">
            {costPerWishlist ? fmtMoney(costPerWishlist) : "—"}
          </p>
          <p className="stat-sub">all outcome types included</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label"><PixelIcon name="key" size={12} /> Demos / keys</p>
          <p className="stat-value">
            {game.totals.demo.toLocaleString()} / {game.totals.key}
          </p>
          <p className="stat-sub">{game.keysAvailable - game.keysUsed} keys left in the pool</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="card chart-card">
          <h3>Wishlists per day — last 30 days</h3>
          <p className="chart-sub">{game.title} · all promoters combined</p>
          <BarChart
            data={wishlistsByDay}
            color="var(--chart-2)"
            formatY={(v) => String(Math.round(v))}
          />
        </div>

        <div className="card">
          <h3>Which promoters delivered</h3>
          <p className="chart-sub">
            Attribution via tracked links — this table is what the dev pays for
          </p>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Promoter</th>
                  <th>Wishlists</th>
                  <th className="num">Clicks</th>
                  <th className="num">Conv.</th>
                  <th className="num">Cost</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.promoter.id} className={r.promoter.isPlayer ? "is-you" : ""}>
                    <td>
                      {r.promoter.avatar} {r.promoter.name}
                      <span className="cell-sub">{r.promoter.channel}</span>
                    </td>
                    <td className="share-cell">
                      <span className="share-num">{r.totals.wishlist.toLocaleString()}</span>
                      <span className="share-bar">
                        <span style={{ width: `${(r.totals.wishlist / maxWl) * 100}%` }} />
                      </span>
                    </td>
                    <td className="num">{r.totals.click.toLocaleString()}</td>
                    <td className="num">
                      {r.totals.click > 0
                        ? `${((r.totals.wishlist / r.totals.click) * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="num">
                      {fmtMoney(r.cost)}
                      {r.voidedCost > 0 && (
                        <span className="cell-sub status voided">
                          <PixelIcon name="skull" size={12} /> +{fmtMoney(r.voidedCost)} voided as fraud, refunded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
