import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import PropTypes from 'prop-types';
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import Register from "./Register";

async function loginUser(credentials) {
  return axios.post('http://localhost:8000/users/signIn', {params: credentials})
}
 
const Login = ({setToken}) => {
  const [registerMode, setRegisterMode] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = useCallback(async () => {
    const query = {username, password}

    const resToken = await loginUser(query)
    setToken(resToken.data.token)
  })
  
  const handleRegister = useCallback(async () => {
    setRegisterMode(true)
  })

  return (          
      <Container component="main" maxWidth="xs">
          <CssBaseline />
          {registerMode ? <Register setToken={setToken} setRegisterMode={setRegisterMode}/> : null}
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
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      autoFocus
                      onChange={(event) => setUsername(event.target.value)}
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

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default Login;