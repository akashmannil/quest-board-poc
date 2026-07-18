// The first-run welcome: an arcade attract screen that greets a brand-new
// player over the app. Shown once (a localStorage flag remembers), skippable
// three ways (Press start, Escape, click outside), and replayable from the
// Guide. It sits *below* the CRT scanline overlay on purpose, so even the
// welcome screen looks like it's running inside the cabinet.

import { useEffect } from "react";
import Logo from "./Logo.jsx";
import PixelIcon from "./PixelIcon.jsx";

// Bumping the suffix would re-show the intro to everyone after a redesign.
export const INTRO_SEEN_KEY = "questboard.introSeen.v1";

export function introAlreadySeen() {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false; // no storage (private mode) -> greet every visit, harmless
  }
}

export function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* no storage — nothing to remember with */
  }
}

const STEPS = [
  {
    icon: "map",
    title: "Pick a quest",
    text: "Indie devs post their games as bounties — real money per verified wishlist, demo or key. Not per post. Not per click.",
  },
  {
    icon: "star",
    title: "Share your link",
    text: "Accepting a quest mints your tracked link. The outcomes it causes are yours, after a 7-day fraud check.",
  },
  {
    icon: "crown",
    title: "Level up",
    text: "Verified work grows your Exposure Score. Keep a streak, climb the tiers, and the same wishlist pays up to 3× more.",
  },
];

export default function IntroModal({ onClose, onGuide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // freeze the page behind the cabinet glass while the intro is up
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="intro-overlay" onClick={onClose} role="presentation">
      <div
        className="intro-card"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to QuestBoard"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="intro-coin">insert coin · free play</p>
        <div className="intro-mark">
          <Logo size={54} />
        </div>
        <h2 className="intro-title">
          Welcome, <span>Player One</span>
        </h2>
        <p className="intro-lede">
          QuestBoard is a marketplace where promoting an indie game <em>is</em>{" "}
          the game. Devs put up the bounty. You spread the word. Verified
          wishlists pay out — whether you have a million followers or none.
        </p>

        <div className="intro-steps">
          {STEPS.map((s, i) => (
            <div className="intro-step" key={s.title}>
              <span className="intro-step-num">{i + 1}</span>
              <PixelIcon name={s.icon} size={22} color="var(--neon-cyan)" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="intro-note">
          <PixelIcon name="hourglass" size={16} color="var(--neon-amber)" />
          <p>
            <strong>Time is a button here.</strong> This world — the traffic,
            the earnings, even the fraud bot — is simulated in your browser.
            Press <b>⏭ Advance day</b> or <b>▶ Autoplay</b> up top and watch
            it live.
          </p>
        </div>

        <div className="intro-actions">
          <button className="btn-primary intro-start" autoFocus onClick={onClose}>
            ▶ Press start
          </button>
          <button className="intro-guide-btn" onClick={onGuide}>
            <PixelIcon name="book" size={13} /> Read the player's guide
          </button>
        </div>
      </div>
    </div>
  );
}
