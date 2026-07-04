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
  // `genre` is an optional pre-selected filter carried onto the Quest Board
  // when arriving from a "browse by genre" click on the homepage.
  const [route, setRoute] = useState({ view: "discover", gameId: null, genre: null });

  const go = useCallback((view) => setRoute({ view, gameId: null, genre: null }), []);
  const openGame = useCallback(
    (gameId) => setRoute({ view: "game", gameId, genre: null }),
    []
  );
  const browseGenre = useCallback(
    (genre) => setRoute({ view: "board", gameId: null, genre }),
    []
  );

  return (
    <NavContext.Provider value={{ route, go, openGame, browseGenre }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
