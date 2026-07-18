// The promoter's home: score, tier, earnings, and the two charts that tell
// the platform's whole story — your score climbing over time, and where that
// score puts you on the S-shaped payout curve.

import { useApp } from "../state/AppState.jsx";
import {
  payoutMultiplier,
  tierFor,
  nextTier,
  MAX_MULT,
} from "../engine/exposure.js";
import {
  earningsSummary,
  earningsByDay,
  weeklyEarnings,
  claimEarnings,
  recentActivity,
} from "../engine/selectors.js";
import { EVENT_TYPES } from "../engine/exposure.js";
import LineChart from "../components/charts/LineChart.jsx";
import BarChart from "../components/charts/BarChart.jsx";
import { fmtMoney } from "../components/charts/utils.js";
import PixelIcon, { OUTCOME_ICONS, TIER_ICONS } from "../components/PixelIcon.jsx";

function TierChip({ score }) {
  const tier = tierFor(score);
  return (
    <span className="tier-chip" style={{ color: tier.color }}>
      <PixelIcon name={TIER_ICONS[tier.name]} size={12} /> {tier.name}
    </span>
  );
}

function StatTile({ icon, label, value, sub, children }) {
  return (
    <div className="stat-tile">
      <p className="stat-label">
        {icon && <PixelIcon name={icon} size={12} />}
        {label}
      </p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
      {children}
    </div>
  );
}

// The logistic payout curve with every promoter placed on it.
function PayoutCurveChart({ state }) {
  const curve = [];
  for (let s = 0; s <= 1000; s += 20)
    curve.push({ x: s, y: payoutMultiplier(s) });

  const dots = Object.values(state.promoters).map((p) => ({
    x: Math.min(1000, p.score),
    y: payoutMultiplier(p.score),
    label: p.isPlayer ? "You" : p.name,
    color: p.isPlayer ? "var(--chart-1)" : "var(--text-faint)",
    showLabel: p.isPlayer,
  }));

  return (
    <LineChart
      data={curve}
      color="var(--chart-2)"
      formatX={(s) => `${Math.round(s)}`}
      formatY={(v) => `${v.toFixed(1)}×`}
      dots={dots}
    />
  );
}

export default function PromoterDashboard() {
  const { state } = useApp();
  const you = state.promoters.you;
  const money = earningsSummary(state, "you");
  const weekly = weeklyEarnings(state, "you");
  const myClaims = state.claims.filter((c) => c.promoterId === "you");
  const mult = payoutMultiplier(you.score);
  const next = nextTier(you.score);

  const leaderboard = Object.values(state.promoters)
    .map((p) => ({ ...p, weekly: weeklyEarnings(state, p.id) }))
    .sort((a, b) => b.score - a.score);

  const activity = recentActivity(state, "you", 8);

  return (
    <section>
      <div className="view-intro">
        <h2>
          <PixelIcon name="chart" size={18} /> My Dashboard
        </h2>
        <p>
          Your Exposure Score turns verified outcomes into a payout multiplier.
          Show up daily and the compounding is steep — until the curve levels
          off at {MAX_MULT}×, leaving room for everyone under the top.
        </p>
      </div>

      {myClaims.length === 0 && (
        <div className="nudge">
          <PixelIcon name="map" size={14} /> You haven't accepted any quests yet
          — pick one on the <strong>Quest Board</strong>, then advance a few
          days and watch this page come alive.
        </div>
      )}

      <div className="stat-row">
        <StatTile
          icon="star"
          label="Exposure Score"
          value={
            <>
              {Math.round(you.score)} <TierChip score={you.score} />
            </>
          }
          sub={
            next
              ? `${Math.max(0, Math.ceil(next.min - you.score))} XP to ${next.name}`
              : "Top tier reached"
          }
        >
          {next && (
            <div className="xp-bar" title={`Progress to ${next.name}`}>
              <div
                style={{
                  width: `${Math.min(
                    100,
                    ((you.score - tierFor(you.score).min) /
                      (next.min - tierFor(you.score).min)) *
                      100
                  )}%`,
                }}
              />
            </div>
          )}
        </StatTile>
        <StatTile
          icon="coin"
          label="Payout multiplier"
          value={`${mult.toFixed(2)}×`}
          sub={`a $0.45 bounty pays you ${fmtMoney(0.45 * mult)}`}
        />
        <StatTile
          icon="flame"
          label="Streak"
          value={you.streak}
          sub="consecutive active days"
        />
        <StatTile
          icon="hourglass"
          label="Pending"
          value={fmtMoney(money.pending)}
          sub="settles 7 days after the outcome"
        />
        <StatTile
          icon="check"
          label="Settled"
          value={fmtMoney(money.settled)}
          sub={`${fmtMoney(weekly)} earned in the last 7 days`}
        />
      </div>

      <div className="dash-grid">
        <div className="card chart-card">
          <h3>Exposure Score over time</h3>
          <p className="chart-sub">Tier thresholds marked on the right</p>
          <LineChart
            data={you.scoreHistory.map((h) => ({ x: h.day, y: h.score }))}
            color="var(--chart-1)"
            refLines={[
              { y: 100, label: "Rising" },
              { y: 300, label: "Established" },
              { y: 600, label: "Partner" },
              { y: 900, label: "Legend" },
            ]}
            endLabel={`${Math.round(you.score)}`}
          />
        </div>

        <div className="card chart-card">
          <h3>The payout curve — where everyone stands</h3>
          <p className="chart-sub">
            Multiplier by Exposure Score · your dot is purple, rivals are grey
          </p>
          <PayoutCurveChart state={state} />
        </div>

        <div className="card chart-card">
          <h3>Daily earnings — last 30 days</h3>
          <p className="chart-sub">Gross bounty payouts credited to you</p>
          <BarChart
            data={earningsByDay(state, "you", 30)}
            color="var(--chart-3)"
            formatY={(v) => fmtMoney(v)}
          />
        </div>

        <div className="card">
          <h3>Leaderboard</h3>
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Promoter</th>
                <th>Tier</th>
                <th className="num">Score</th>
                <th className="num">Last 7 days</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((p, i) => (
                <tr key={p.id} className={p.isPlayer ? "is-you" : ""}>
                  <td>{i + 1}</td>
                  <td>
                    {p.avatar} {p.name}
                    <span className="cell-sub">{p.channel}</span>
                  </td>
                  <td><TierChip score={p.score} /></td>
                  <td className="num">{Math.round(p.score)}</td>
                  <td className="num">{fmtMoney(p.weekly)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="card">
          <h3>My quests</h3>
          {myClaims.length === 0 ? (
            <p className="empty-note">Nothing yet — accept a quest to start earning.</p>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th className="num" title="Link clicks"><PixelIcon name="cursor" size={12} /></th>
                  <th className="num" title="Steam wishlists"><PixelIcon name="star" size={12} /></th>
                  <th className="num" title="Demo downloads"><PixelIcon name="download" size={12} /></th>
                  <th className="num" title="Keys redeemed"><PixelIcon name="key" size={12} /></th>
                  <th className="num">Earned</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {state.games[c.gameId].art.emoji} {state.games[c.gameId].title}
                      <span className="cell-sub">since day {c.dayClaimed}</span>
                    </td>
                    <td className="num">{c.totals.click.toLocaleString()}</td>
                    <td className="num">{c.totals.wishlist.toLocaleString()}</td>
                    <td className="num">{c.totals.demo.toLocaleString()}</td>
                    <td className="num">{c.totals.key.toLocaleString()}</td>
                    <td className="num">{fmtMoney(claimEarnings(state, c.id))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Recent activity</h3>
          {activity.length === 0 ? (
            <p className="empty-note">Outcomes from your links will show up here.</p>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Outcome</th>
                  <th>Game</th>
                  <th className="num">Payout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((e) => (
                  <tr key={e.id}>
                    <td>{e.day}</td>
                    <td>
                      <PixelIcon name={OUTCOME_ICONS[e.type]} size={13} />{" "}
                      {e.count}× {EVENT_TYPES[e.type].label}
                    </td>
                    <td>{state.games[e.gameId].title}</td>
                    <td className="num">{fmtMoney(e.gross)}</td>
                    <td>
                      {e.settlesOnDay <= state.day ? (
                        <span className="status settled">
                          <PixelIcon name="check" size={12} /> settled
                        </span>
                      ) : (
                        <span className="status pending">
                          <PixelIcon name="hourglass" size={12} /> pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
