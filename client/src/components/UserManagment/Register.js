import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import PropTypes from 'prop-types';
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import { useNavigate } from "react-router";
import { AppContext } from "../../store/AppContext";

const Register = ({setToken, setRegisterMode}) => {
    const navigate = useNavigate();
    const [ , dispatch] = useContext(AppContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const handleRegister = () => {
        const query = {username, password, email}

        axios
        .post('http://localhost:8000/users/register', query)
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

            navigate(res.data.user.is_host ? '/hostHome' : '/guestHome')

        })
        .catch((err) => {
            alert(err.response.data)
        });
    }

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
                  Register
              </Typography>
              <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="email"
                      name="email"
                      autoComplete="enail"
                      autoFocus
                      onChange={(event) => setEmail(event.target.value)}
                  />
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
                      onClick={handleRegister}
                  >
                      Register
                  </Button>
          </Box>
      </Container>
  )
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired,
  setRegisterMode: PropTypes.func.isRequired
};

export default Register;