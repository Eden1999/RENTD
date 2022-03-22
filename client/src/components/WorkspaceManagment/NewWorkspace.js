import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../store/AppContext";
import PropTypes, { checkPropTypes } from "prop-types";
import { Container, CssBaseline, Box, Typography, TextField, Button } from "@mui/material";
import useToken from "../../helpers/useToken";
import Checkbox from "@mui/material/Checkbox";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import TimePicker from '@mui/lab/TimePicker';

import TimePicker from 'react-time-picker';

const NewWorkspace = (props) => {
  const [{ user }] = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("erros: ");
  const [name, setName] = useState(null);
  const [host_id, setHostId] = useState(user.host_id);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [location_x, setLocationX] = useState(1.0);
  const [location_y, setLocationY] = useState(1.0);
  const [cost_per_hour, setCostPerHour] = useState(10);
  const [capacity, setCapacity] = useState(20);
  const [wifi, setWifi] = useState(true);
  const [disabled_access, setDisabledAccess] = useState(true);
  const [smoke_friendly, setSmokeFriendly] = useState(true);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [space_type_id, setSpaceTypeId] = useState(1);
  const { token } = useToken();
  const [opening_days, setOpeningDays] = useState([false, false, false, false, false, false, false])
  const [opening_hour, setOpeningHour] = useState('10:00');
  const [closing_hour, setClosingHour] = useState('23:00');

  const checkUserValidation = () => {
    let errors = "";
    let isFormValid = true;

    //Name
    if (!name) {
      isFormValid = false;
      errors = errors + " name annot be empty ";
      setErrorMessage(errors);
    }

    return isFormValid;
  };

  const handleSave = useCallback(async () => {
    if (checkUserValidation()) {
      const query = {
        name,
        city,
        address,
        location_x,
        location_y,
        cost_per_hour,
        capacity,
        wifi,
        disabled_access,
        smoke_friendly,
        description,
        space_type_id,
        photo,
        opening_days,
        opening_hour,
        closing_hour
      };

      axios
        .post("http://localhost:8000/workspaces/create", query, {
          headers: {
            token,
          },
        })
        .then((res) => {
          console.log("success");
        })
        .catch((err) => {
          alert(err.response.data);
        });
    } else {
      alert(`${errorMessage}`);
    }
  });

  const handleChangeIsWifi = () => {
    setWifi(!wifi);
  };

  const handleChangeDisabledAccess = () => {
    setDisabledAccess(!disabled_access);
  };

  const HandleChangeSmokeFriendly = () => {
    setSmokeFriendly(!smoke_friendly);
  };

  const HandleChangeOpeningDays = ({target: {checked, id}}) => {
    let newArray = [...opening_days]
    newArray[id] = checked
    setOpeningDays(newArray)
  //   setOpeningDays(opening_days=>({
  //     ...opening_days,
  //     [id]: checked
  //  }))
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const base64Photo = await convertToBase64(file);
    setPhoto(base64Photo);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
          name="city"
          label="city"
          type="city"
          id="city"
          autoComplete="city"
          onChange={(event) => setCity(event.target.value)}
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
          name="capacity"
          label="capacity"
          type="capacity"
          id="capacity"
          autoComplete="capacity"
          onChange={(event) => setCapacity(event.target.value)}
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
          inputProps={{ "aria-label": "controlled" }}
        />
        <a>disabled access</a>
        <Checkbox
          checked={disabled_access}
          onChange={handleChangeDisabledAccess}
          inputProps={{ "aria-label": "controlled" }}
        />
        <a>smoke friendly</a>
        <Checkbox
          checked={smoke_friendly}
          onChange={HandleChangeSmokeFriendly}
          inputProps={{ "aria-label": "controlled" }}
        />
        <a>set opening days</a>
        <a>sunday</a>
        <Checkbox
          checked={opening_days[0]}
          id={0}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>monday</a>
        <Checkbox
          checked={opening_days[1]}
          id={1}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>tuesday</a>
        <Checkbox
          checked={opening_days[2]}
          id={2}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>wednesday</a>
        <Checkbox
          checked={opening_days[3]}
          id={3}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>thursday</a>
        <Checkbox
          checked={opening_days[4]}
          id={4}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>friday</a>
        <Checkbox
          checked={opening_days[5]}
          id={5}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>saturday</a>
        <Checkbox
          checked={opening_days[6]}
          id={6}
          onChange={HandleChangeOpeningDays}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <a>set hours</a>
          <a>opening hour</a>
          <TimePicker
            onChange={setOpeningHour}
            value={opening_hour}/>
          <TimePicker
            onChange={setClosingHour}
            value={closing_hour}/>
        <input
          type="file"
          label="Photo"
          name="photo"
          accept=".jpeg, .png, .jpg"
          onChange={handlePhotoUpload}
        />
        <div className="photo-preview">
          <img src={photo} />
        </div>
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
  );
};

NewWorkspace.propTypes = {};

export default NewWorkspace;
