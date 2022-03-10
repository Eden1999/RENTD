import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import PropTypes from 'prop-types';
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";

const Register = ({setToken, setRegisterMode}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = () => {
        const query = {username, password}

        axios
        .post('http://localhost:8000/users/register', {params: query})
        .then((res) => {
            if(res.data.token) {
            setToken(res.data.token)
            } else {
                alert("The password you've entered is incorrect! please try again")
            }
            setRegisterMode(false)
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