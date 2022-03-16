import React, {useReducer} from "react";
import './App.css'
import { AppContext, reducer } from "../../store/AppContext";
import ShellView from "../../modules/shell/components/ShellView";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {user : JSON.parse(sessionStorage.getItem('user')) || {}});

  return (
    <div className="App">
      <AppContext.Provider value={[state, dispatch]}>
            <ShellView />
      </AppContext.Provider>
    </div>
  )
}

export default App;