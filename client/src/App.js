import React, {useReducer} from "react";
import './App.css'
import { AppContext, reducer } from "./store/AppContext";
import ShellView from "./modules/Shell/ShellView";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [state, dispatch] = useReducer(reducer, {user : JSON.parse(sessionStorage.getItem('user')) || {}});

  return (
      <AppContext.Provider value={[state, dispatch]}>
            <ShellView />
            <ToastContainer theme="dark" position="top-center"/>
      </AppContext.Provider>
  )
}

export default App;