// The anti-fraud panel. Any platform that pays cash for clicks will be
// attacked within a week of launch — this screen shows the defenses this
// PoC actually simulates, the live log of what they caught, and (honestly)
// what a production system would still need.

import { useApp } from "../state/AppState.jsx";
import { fmtMoney } from "../components/charts/utils.js";

const DEFENSES = [
  {
    icon: "✅",
    title: "Pay for outcomes, never activity",
    live: true,
    text: "Nobody earns for posting or clicking around. Only verified outcomes (wishlists, demos, key redemptions) pay — which makes most spam economically pointless before any detection runs.",
  },
  {
    icon: "⏳",
    title: "7-day settlement window",
    live: true,
    text: "Earnings sit as 'pending' for a week before money moves. Fraud found inside the window is voided at zero cost — the money never left.",
  },
  {
    icon: "📈",
    title: "Velocity + conversion anomaly detection",
    live: true,
    text: "Every promoter is compared against their own trailing 7-day average. A day with a 5×+ click spike that converts below 3% is voided automatically: real virality converts, purchased clicks don't.",
  },
  {
    icon: "🧮",
    title: "Reputation that fraud can't buy",
    live: true,
    text: "A flagged day docks the Exposure Score 5% and resets the streak, and the daily score-gain cap means no burst of traffic — real or fake — can rocket an account up the payout curve overnight.",
  },
  {
    icon: "💸",
    title: "Devs never pay for voided traffic",
    live: true,
    text: "Voided outcomes refund the developer's budget and are stripped from public counts. The attribution table in Dev HQ shows the refund line, so the defense is visible to the paying side.",
  },
  {
    icon: "🏗️",
    title: "What production would add",
    live: false,
    text: "Steam UTM cross-checks on every wishlist, device/IP fingerprinting, identity verification before first payout, random manual review of top earners, and clawbacks after settlement for slow-burn fraud.",
  },
];

export default function TrustSafety() {
  const { state } = useApp();

  const flags = [...state.fraudFlags].reverse();
  const voided = state.ledger.filter((e) => e.voided);
  const withheld = voided.reduce((a, e) => a + e.gross, 0);
  const refunded = voided.reduce((a, e) => a + e.devCost, 0);
  const accounts = new Set(flags.map((f) => f.promoterId));

  const withheldFor = (flag) =>
    state.ledger
      .filter((e) => e.voided && e.day === flag.day && e.promoterId === flag.promoterId)
      .reduce((a, e) => a + e.gross, 0);

  return (
    <section>
      <div className="view-intro">
        <h2>🛡️ Trust & Safety</h2>
        <p>
          A platform that pays cash for clicks gets attacked in week one. This
          panel shows the defenses the simulation actually runs — and what they
          have caught so far in this run.
        </p>
      </div>

      <div className="stat-row">
        <div className="stat-tile">
          <p className="stat-label">Fraud flags raised</p>
          <p className="stat-value">{flags.length}</p>
          <p className="stat-sub">in {state.day} simulated days</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Payouts withheld</p>
          <p className="stat-value">{fmtMoney(withheld)}</p>
          <p className="stat-sub">voided before settlement</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Refunded to devs</p>
          <p className="stat-value">{fmtMoney(refunded)}</p>
          <p className="stat-sub">budget returned for fake outcomes</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Accounts flagged</p>
          <p className="stat-value">{accounts.size}</p>
          <p className="stat-sub">
            {[...accounts].map((id) => state.promoters[id].name).join(", ") || "none yet"}
          </p>
        </div>
      </div>

      <div className="defense-grid">
        {DEFENSES.map((d) => (
          <div key={d.title} className="card defense-card">
            <h3>
              {d.icon} {d.title}
            </h3>
            <span className={d.live ? "defense-badge live" : "defense-badge"}>
              {d.live ? "simulated in this PoC" : "design note"}
            </span>
            <p>{d.text}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Fraud log</h3>
        <p className="chart-sub">
          Every automatic void in this run, newest first
        </p>
        {flags.length === 0 ? (
          <p className="empty-note">
            Nothing caught yet — advance a few days. (TurboClicks99 🤖 buys
            click-farm traffic roughly every five days.)
          </p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Account</th>
                  <th>What the detector saw</th>
                  <th className="num">Withheld</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((f, i) => (
                  <tr key={i}>
                    <td>{f.day}</td>
                    <td>
                      {state.promoters[f.promoterId].avatar}{" "}
                      {state.promoters[f.promoterId].name}
                    </td>
                    <td className="flag-detail">{f.detail}</td>
                    <td className="num status voided">{fmtMoney(withheldFor(f))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
