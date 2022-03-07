import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../store/AppContext";
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";

const Login = (props) => {
  const navigate = useNavigate();
  const [ , dispatch] = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = useCallback(async () => {
    const query = {username, password}

    axios
      .get('http://localhost:8000/users/login', {params: query})
      .then((res) => {
        if(res.data.isAdmin) {
          dispatch({
            type: "SET_GENERAL_STATE",
            payload: {
              username: query.username,
              isAdmin: true,
            },
          })

          navigate('/manage/manageMessages')
        } else {
          alert("The password you've entered is incorrect! please try again")
        }
      })
      .catch(() => {
          alert("There was an error while trying to log in! please try again")
      });
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
          </Box>
      </Container>
  )
}

export default Login;