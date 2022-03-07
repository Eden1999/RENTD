import { createContext } from "react";

export function reducer(
  state,
  action
) {
  switch (action.type) {
    case "SET_GENERAL_STATE":
      return { ...state, ...action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const AppContext = createContext({isAdmin : false});
