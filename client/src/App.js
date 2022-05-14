import React, {useReducer} from "react";
import './App.css'
import { AppContext, reducer } from "./store/AppContext";
import ShellView from "./modules/Shell/ShellView";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {user : JSON.parse(sessionStorage.getItem('user')) || {}});

  return (
      <AppContext.Provider value={[state, dispatch]}>
            <ShellView />
      </AppContext.Provider>
  )
}

export default App;