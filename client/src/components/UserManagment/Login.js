import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import Register from "./Register";
import useToken from "../../helpers/useToken";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../store/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const [ , dispatch] = useContext(AppContext)
  const [registerMode, setRegisterMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { token, setToken } = useToken();

  const handleLogin = useCallback(async () => {
    const query = {email, password}

    axios.post('http://localhost:8000/users/signIn', query)
    .then((res) => {
        if(res.data.token) {
            setToken(res.data.token)
        }

        dispatch({
            type: "SET_GENERAL_STATE",
            payload: {
              user : res.data.user
            },
        })

        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        navigate(res.data.user.is_host ? '/my-spaces' : '/homepage')
    })
    .catch(err =>{
        alert(err.response.data)
    })
  })

  const handleRegister = useCallback(async () => {
      navigate('/register');
  })

  return (          
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
              sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
              }}
          >
              <Typography component="h1" variant="h5">
                  Login
              </Typography>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="email"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      onChange={(event) => setEmail(event.target.value)}
                  />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleLogin}
                  >
                      Login
                  </Button>
                  <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleRegister}
                  >
                      Register
                  </Button>
          </Box>
      </Container>
  )
}

Login.propTypes = {};

export default Login;