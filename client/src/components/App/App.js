import React, {useEffect, useState, useReducer} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { AppContext, reducer } from "../../store/AppContext";
import Login from "../UserManagment/Login";
import { AxiosInstance } from '../../helpers/axios';
import ShellView from "../../modules/shell/components/ShellView";
import useToken from './useToken';

const App = () => {
  const { token, setToken } = useToken();

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