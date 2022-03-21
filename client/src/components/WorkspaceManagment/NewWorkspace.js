import React, { useState, useCallback, useContext } from "react"
import axios from 'axios'
import { AppContext } from "../../store/AppContext";
import PropTypes from 'prop-types';
import {Container, CssBaseline, Box, Typography, TextField, Button} from "@mui/material";
import useToken from "../../helpers/useToken";
import Checkbox from '@mui/material/Checkbox';

const NewWorkspace = (props) => {
    const [{ user }] = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState("erros: ")
    const [name, setName] = useState(null)
    const [host_id, setHostId] = useState(user.host_id)
    const [address, setAddress] = useState('')
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
    const []

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

    const handleChangeIsWifi = () => {
        setWifi(!wifi)
    }

    const handleChangeDisabledAccess = () => {
      setDisabledAccess(!disabled_access)
    }

    const HandleChangeSmokeFriendly = () => {
        setSmokeFriendly(!smoke_friendly)
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
                        name="address"
                        label="address"
                        type="address"
                        id="address"
                        autoComplete="address"
                        onChange={(event) => setAddress(event.target.value)}
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="cost per hour"
                        label="how much do you take per hour?"
                        type="cost per hour"
                        id="cost per hour"
                        autoComplete="cost per hour"
                        onChange={(event) => setCostPerHour(event.target.value)}
                    />
                    Do you have any from the next:
                    <a>wifi</a>
                    <Checkbox
                      checked={wifi}
                      onChange={handleChangeIsWifi}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <a>disabled access</a>
                    <Checkbox
                      checked={disabled_access}
                      onChange={handleChangeDisabledAccess}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <a>smoke friendly</a>
                    <Checkbox
                      checked={smoke_friendly}
                      onChange={HandleChangeSmokeFriendly}
                      inputProps={{ 'aria-label': 'controlled' }}
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