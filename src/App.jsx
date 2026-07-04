import { AppProvider } from "./state/AppState.jsx";
import { NavProvider, useNav } from "./state/Nav.jsx";
import DayControls from "./components/DayControls.jsx";
import PixelIcon from "./components/PixelIcon.jsx";
import Logo from "./components/Logo.jsx";
import Discover from "./views/Discover.jsx";
import QuestBoard from "./views/QuestBoard.jsx";
import PromoterDashboard from "./views/PromoterDashboard.jsx";
import DevHQ from "./views/DevHQ.jsx";
import TrustSafety from "./views/TrustSafety.jsx";
import GamePage from "./views/GamePage.jsx";

const TABS = [
  { id: "discover", label: "Discover", icon: "gem" },
  { id: "board", label: "Quest Board", icon: "map" },
  { id: "promoter", label: "My Dashboard", icon: "chart" },
  { id: "dev", label: "Dev HQ", icon: "gamepad" },
  { id: "trust", label: "Trust & Safety", icon: "shield" },
];

function Shell() {
  const { route, go } = useNav();
  const view = route.view;

  return (
    <div className="shell">
      <header className="topbar">
        <button className="logo-lockup" onClick={() => go("discover")}>
          <Logo size={42} />
          <div>
            <h1 className="logo">
              QUEST<span>BOARD</span>
            </h1>
            <p className="tagline">PROMOTE INDIE GAMES · LEVEL UP · GET PAID</p>
          </div>
        </button>
        <nav className="nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={view === t.id ? "active" : ""}
              onClick={() => go(t.id)}
            >
              <PixelIcon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </nav>
        <DayControls />
      </header>

      <main>
        {view === "discover" ? (
          <Discover />
        ) : view === "board" ? (
          <QuestBoard />
        ) : view === "promoter" ? (
          <PromoterDashboard />
        ) : view === "dev" ? (
          <DevHQ />
        ) : view === "trust" ? (
          <TrustSafety />
        ) : (
          <GamePage />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavProvider>
        <Shell />
      </NavProvider>
    </AppProvider>
  );
}
