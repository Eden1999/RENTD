import React, {useState, useCallback, useContext} from "react"
import axios from 'axios'
import {Container, CssBaseline, Box, Typography, TextField, Button, InputAdornment} from "@mui/material";
import Register from "./Register";
import useToken from "../../helpers/useToken";
import {useNavigate} from 'react-router-dom';
import {AppContext} from "../../store/AppContext";
import {DraftsOutlined} from "@mui/icons-material";

const Login = () => {
    const navigate = useNavigate();
    const [, dispatch] = useContext(AppContext)
    const [registerMode, setRegisterMode] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {token, setToken} = useToken();

    const handleLogin = useCallback(async () => {
        const query = {email, password}

        axios.post('http://localhost:8000/users/signIn', query)
            .then((res) => {
                if (res.data.token) {
                    setToken(res.data.token)
                }

                dispatch({
                    type: "SET_GENERAL_STATE",
                    payload: {
                        user: res.data.user
                    },
                })

                sessionStorage.setItem('user', JSON.stringify(res.data.user));
                navigate(res.data.user.is_host ? '/my-spaces' : '/homepage')
            })
            .catch(err => {
                alert(err.response.data)
            })
    })

    const handleRegister = useCallback(async () => {
        navigate('/register');
    })

    return (
        <div className="w-1/3 self-center m-8">
            <div className="mb-12">
                <span className="font-semibold text-6xl text-primary">
                  Login
                </span>
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-primary">
                    Email Address:
                </label>
                <input className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                       placeholder={'email@address.com'}
                       onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="mb-6">
                <label className="block mb-2 text-lg font-medium text-primary">
                    Password:
                </label>
                <input type="password"
                       className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                       placeholder={'******'}
                       onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <span
                className={'mb-6 text-md text-blue-500 cursor-pointer underline decoration-blue-500'}
                onClick={() => navigate('/reset-password')}
            >
                reset password
            </span>
            <div className="flex mb-6 justify-center">
                <div>
                    <button type="button" className={"btn btn-lg btn-primary"} onClick={handleLogin}>Login</button>
                </div>
                <div className="ml-8">
                    <button type="button" className={"btn btn-lg btn-secondary text-white"} onClick={handleRegister}>Register</button>
                </div>
            </div>
        </div>
    )
}

Login.propTypes = {};

export default Login;
