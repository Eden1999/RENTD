import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import PropTypes from 'prop-types';
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import Register from "./Register";

const Login = ({setToken}) => {
  const [registerMode, setRegisterMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = useCallback(async () => {
    const query = {email, password}

    axios.post('http://localhost:8000/users/signIn', query)
    .then((res) => {
        if(res.data.token) {
            setToken(res.data.token)
        }
    })
    .catch(err =>{
        alert(err.response.data)
    })
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

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default Login;