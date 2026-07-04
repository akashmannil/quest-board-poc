// The demo's remote control: step the simulated world forward one day,
// let it autoplay, or reset the whole run back to day 14.

import { useEffect, useState } from "react";
import { useApp } from "../state/AppState.jsx";

export default function DayControls() {
  const { state, dispatch } = useApp();
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => dispatch({ type: "ADVANCE_DAY" }), 900);
    return () => clearInterval(t);
  }, [autoplay, dispatch]);

  return (
    <div className="day-controls">
      {/* keyed on the day so the element remounts and replays the tick pulse */}
      <span className="day-badge ticking" key={state.day}>
        Day {state.day}
      </span>
      <button className="btn-primary" onClick={() => dispatch({ type: "ADVANCE_DAY" })}>
        ⏭ Advance day
      </button>
      <button
        className={autoplay ? "btn-toggle on" : "btn-toggle"}
        onClick={() => setAutoplay((v) => !v)}
      >
        {autoplay ? "⏸ Pause" : "▶ Autoplay"}
      </button>
      <button
        className="btn-ghost"
        onClick={() => {
          setAutoplay(false);
          dispatch({ type: "RESET" });
        }}
      >
        ↺ Reset
      </button>
    </div>
  );
}
