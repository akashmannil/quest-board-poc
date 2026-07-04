import { useState } from "react";
import { AppProvider } from "./state/AppState.jsx";
import DayControls from "./components/DayControls.jsx";
import QuestBoard from "./views/QuestBoard.jsx";
import PromoterDashboard from "./views/PromoterDashboard.jsx";
import DevHQ from "./views/DevHQ.jsx";
import TrustSafety from "./views/TrustSafety.jsx";

const TABS = [
  { id: "board", label: "🗺️ Quest Board" },
  { id: "promoter", label: "📈 My Dashboard" },
  { id: "dev", label: "🎮 Dev HQ" },
  { id: "trust", label: "🛡️ Trust & Safety" },
];

export default function App() {
  const [tab, setTab] = useState("board");

  return (
    <AppProvider>
      <div className="shell">
        <header className="topbar">
          <div>
            <h1 className="logo">
              Quest<span>Board</span>
            </h1>
            <p className="tagline">Promote indie games. Level up. Get paid.</p>
          </div>
          <nav className="nav">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "active" : ""}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <DayControls />
        </header>

        <main>
          {tab === "board" ? (
            <QuestBoard />
          ) : tab === "promoter" ? (
            <PromoterDashboard />
          ) : tab === "dev" ? (
            <DevHQ />
          ) : (
            <TrustSafety />
          )}
        </main>
      </div>
    </AppProvider>
  );
}
