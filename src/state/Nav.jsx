// ---------------------------------------------------------------------------
// Tiny navigation store. Kept separate from the simulation state so that
// moving between screens (or opening a game page) never touches the world —
// and Reset never kicks you off the page you're reading.
//
// A "route" is just { view, gameId }. No router library: this is a PoC with
// a handful of screens, and a 20-line store is easier to follow than a
// dependency.
// ---------------------------------------------------------------------------

import { createContext, useContext, useState, useCallback } from "react";

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [route, setRoute] = useState({ view: "discover", gameId: null });

  const go = useCallback((view) => setRoute({ view, gameId: null }), []);
  const openGame = useCallback(
    (gameId) => setRoute({ view: "game", gameId }),
    []
  );

  return (
    <NavContext.Provider value={{ route, go, openGame }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
