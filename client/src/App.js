import React, {useEffect, useReducer} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { AppContext, reducer } from "./store/AppContext";
import Login from "./components/UserManagment/Login";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {isAdmin : false});

  return (
  <div className="App">
    <AppContext.Provider value={[state, dispatch]}>
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
    </AppContext.Provider>
  </div>
  )
}

export default App;