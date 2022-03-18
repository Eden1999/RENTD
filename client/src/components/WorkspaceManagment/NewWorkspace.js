import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import PropTypes from 'prop-types';
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import useToken from "../../helpers/useToken";

const NewWorkspace = (props) => {
    const [errorMessage, setErrorMessage] = useState("erros: ")
  const [name, setName] = useState(null)
  const [host_id, setHostId] = useState(2)
  const [location, setLocation] = useState('')
  const [location_x, setLocationX] = useState(1.0)
  const [location_y, setLocationY] = useState(1.0)
  const [cost_per_hour, setCostPerHour] = useState(10)
  const [capacity, setCapacity] = useState(20)
  const [wifi, setWifi] = useState(true)
  const [disabled_access, setDisabledAccess] = useState(true)
  const [smoke_friendly, setSmokeFriendly] = useState(true)
  const [description, setDescription] = useState('')
  const [space_type_id, setSpaceTypeId] = useState(2)
  const { token } = useToken();

  const checkUserValidation = () => {
    let errors = '';
    let isFormValid = true;

    //Name
    if (!name) {
        isFormValid = false;
        errors = errors + ' name annot be empty '
        setErrorMessage(errors)
    }

    return isFormValid
  }

  const handleSave = useCallback(async () => {
      if (checkUserValidation()) {
        const query = {name, location_x, location_y, cost_per_hour, capacity, wifi, disabled_access, smoke_friendly, description, space_type_id}

        axios.post('http://localhost:8000/workspaces/create', query, {
            headers: {
                token
            }
        })
        .then((res) => {
            console.log("success")
        })
        .catch(err =>{
            alert(err.response.data)
        })
      } else {
        alert(`${errorMessage}`)
      }
    
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
                  Create new Workspace
              </Typography>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      onChange={(event) => setName(event.target.value)}
                  />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="location"
                      label="location"
                      type="location"
                      id="location"
                      autoComplete="location"
                      onChange={(event) => setLocation(event.target.value)}
                  />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="description"
                      label="description"
                      type="description"
                      id="description"
                      autoComplete="description"
                      onChange={(event) => setDescription(event.target.value)}
                  />
                  <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleSave}
                  >
                      Save
                  </Button>
          </Box>
      </Container>
  )
}

NewWorkspace.propTypes = {};

export default NewWorkspace;