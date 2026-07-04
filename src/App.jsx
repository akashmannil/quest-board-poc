import { useState } from "react";
import { AppProvider } from "./state/AppState.jsx";
import DayControls from "./components/DayControls.jsx";
import PixelIcon from "./components/PixelIcon.jsx";
import Logo from "./components/Logo.jsx";
import QuestBoard from "./views/QuestBoard.jsx";
import PromoterDashboard from "./views/PromoterDashboard.jsx";
import DevHQ from "./views/DevHQ.jsx";
import TrustSafety from "./views/TrustSafety.jsx";

const TABS = [
  { id: "board", label: "Quest Board", icon: "map" },
  { id: "promoter", label: "My Dashboard", icon: "chart" },
  { id: "dev", label: "Dev HQ", icon: "gamepad" },
  { id: "trust", label: "Trust & Safety", icon: "shield" },
];

export default function App() {
  const [tab, setTab] = useState("board");

  return (
    <AppProvider>
      <div className="shell">
        <header className="topbar">
          <div className="logo-lockup">
            <Logo size={42} />
            <div>
              <h1 className="logo">
                QUEST<span>BOARD</span>
              </h1>
              <p className="tagline">PROMOTE INDIE GAMES · LEVEL UP · GET PAID</p>
            </div>
          </div>
          <nav className="nav">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={tab === t.id ? "active" : ""}
                onClick={() => setTab(t.id)}
              >
                <PixelIcon name={t.icon} size={14} />
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
