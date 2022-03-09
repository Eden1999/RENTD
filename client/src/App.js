import React, {useEffect, useState, useReducer} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { AppContext, reducer } from "./store/AppContext";
import Login from "./components/UserManagment/Login";
import { AxiosInstance } from './Helpers/axios';
import ShellView from "./modules/shell/components/ShellView";

const setToken = (userToken) => {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

const getToken = () =>  {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken ? userToken : null
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, {isAdmin : false});
  const [token, setToken] = useState(getToken());

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
  <div className="App">
    <ShellView />
  </div>
  )
}

export default App;