import { useState } from "react";

const TABS = [
  { id: "board", label: "🗺️ Quest Board" },
  { id: "promoter", label: "📈 My Dashboard" },
  { id: "dev", label: "🎮 Dev HQ" },
  { id: "trust", label: "🛡️ Trust & Safety" },
];

export default function App() {
  const [tab, setTab] = useState("board");

  return (
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
      </header>

      <main>
        <div className="placeholder">
          <h2>{TABS.find((t) => t.id === tab).label}</h2>
          <p>This section will be built in an upcoming commit.</p>
        </div>
      </main>
    </div>
  );
}
