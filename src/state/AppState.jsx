// ---------------------------------------------------------------------------
// Global app state: one React context holding the whole simulated world.
// Components read it with useApp() and change it by dispatching actions.
// ---------------------------------------------------------------------------

import { createContext, useContext, useReducer } from "react";
import {
  buildInitialState,
  simulateDay,
  claimQuest,
  postReview,
} from "../engine/simulation.js";

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADVANCE_DAY":
      return simulateDay(state);
    case "CLAIM_QUEST":
      // In this PoC the person at the keyboard is always promoter "you".
      return claimQuest(state, "you", action.gameId);
    case "POST_REVIEW":
      return postReview(state, action.gameId, action.review);
    case "RESET":
      return buildInitialState();
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
