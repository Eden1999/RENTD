import React, {useState, useCallback, useContext} from "react"
import axios from 'axios'
import {Container, CssBaseline, Box, Typography, TextField, Button, InputAdornment} from "@mui/material";
import Register from "./Register";
import useToken from "../../helpers/useToken";
import {Route, Routes, useNavigate} from 'react-router-dom';
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
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <span className={"font-semibold text-3xl text-zinc-300"}>
                  Login
                </span>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-zinc-400">
                        Email Address:
                    </label>
                    <input className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                           placeholder={'email@address.com'}
                           onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-zinc-400">
                        Password:
                    </label>
                    <input type="password"
                           className="input 2xl:select-lg font-normal w-full bg-zinc-700 text-white"
                           placeholder={'******'}
                           onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <label
                    className={'mt-6 text-sm text-blue-500 cursor-pointer underline decoration-blue-500'}
                    onClick={() => navigate('/reset-password')}
                >
                    reset password
                </label>
                <div className="flex mb-6 justify-end">
                    <button type="button" className={"btn btn-lg btn-primary"} onClick={handleLogin}>Login</button>
                </div>
                <div className="flex mb-6 justify-end">
                    <button type="button" className={"btn btn-lg btn-primary"} onClick={handleRegister}>Register</button>
                </div>
            </Box>
        </Container>
    )
}

Login.propTypes = {};

export default Login;