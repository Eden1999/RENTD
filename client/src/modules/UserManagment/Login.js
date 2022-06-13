import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import useToken from "../../helpers/useToken";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const [, dispatch] = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useToken();

  const handleLogin = useCallback(async () => {
    const query = { email, password };

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/users/signIn`, query)
      .then((res) => {
        if (res.data.token) {
          setToken(res.data.token);
        }

        dispatch({
          type: "SET_GENERAL_STATE",
          payload: {
            user: res.data.user,
          },
        });

        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        navigate(res.data.user.is_host ? "/my-spaces" : "/homepage");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  });

  const handleRegister = useCallback(async () => {
    navigate("/register");
  });

  return (
    <div className="w-1/3 self-center m-8">
      <div className="mb-12">
        <span className="font-semibold text-6xl text-primary">Login</span>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-primary">Email Address:</label>
        <input
          className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
          placeholder={"email@address.com"}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-primary">Password:</label>
        <input
          type="password"
          className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
          placeholder={"******"}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <span
          className="text-md text-blue-500 cursor-pointer underline decoration-blue-500"
          onClick={() => navigate("/reset-password")}
      >
        Forgot password
      </span>
      <div className="flex my-6 justify-center">
          <button type="button" className={"btn btn-lg btn-primary"} onClick={handleLogin}>
            Login
          </button>
          <button
            type="button"
            className={"btn btn-lg btn-secondary text-white ml-8"}
            onClick={handleRegister}
          >
            Register
          </button>
      </div>
    </div>
  );
};

Login.propTypes = {};

export default Login;
