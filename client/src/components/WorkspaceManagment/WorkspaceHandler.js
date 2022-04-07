import React, {useState, useCallback, useContext, useEffect} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../../store/AppContext";
import {Container, CssBaseline, Box, TextField, Button, Autocomplete, OutlinedInput} from "@mui/material";
import useToken from "../../helpers/useToken";
import Checkbox from "@mui/material/Checkbox";
import './NewWorkspace.scss'
import _ from 'lodash';

import TimePicker from 'react-time-picker';
import Axios from "axios";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

const daysCheckBox = [{dayName : 'sunday'}, {dayName : 'monday'},
{dayName : 'tuesday'}, {dayName : 'wednesday'}, {dayName : 'thursday'}, {dayName : 'friday'}
, {dayName : 'saturday'}]

const WorkspaceHandler = () => {
  let location = useLocation()
  const navigate = useNavigate();
  const [{ user }] = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("erros: ");
  const [workspace, setWorkspace] = useState({});
  const [isInCreateMode, setIsInCreateMode] = useState(true) 
  const [name, setName] = useState("");
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
  const [spaceType, setSpaceType] = useState({id:1,name:''});
  const { token } = useToken();
  const [opening_days, setOpeningDays] = useState([false, false, false, false, false, false, false])
  const [opening_hour, setOpeningHour] = useState('10:00');
  const [closing_hour, setClosingHour] = useState('23:00');
  const [spaceTypes, setSpaceTypes] = useState([{id:1,name:''}]);

  useEffect(() => {
    console.log('hey')
    setWorkspace(_.get(location, 'state.workspace'))
  }, [location]);

  // Get space types from the server to the environment selector
  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get("http://localhost:8000/spacetypes", query);
      setSpaceTypes(res.data);
      setSpaceType(res.data[0]);
    } catch (err) {
      console.log(`Failed to fetch spaceTypes ${err.message}`);
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(workspace)) {
      setIsInCreateMode(false)
      setName(workspace.name)
      setCity(workspace.city || "")
      setAddress(workspace.address || "")
      setCostPerHour(workspace.cost_per_hour)
      setCapacity(workspace.capacity)
      setWifi(workspace.wifi)
      setDisabledAccess(workspace.disabled_access)
      setSmokeFriendly(workspace.smoke_friendly)
      setDescription(workspace.description)
      setPhoto(workspace.photo || "")
      setSpaceType(workspace.spaceType)
      setOpeningDays(workspace.opening_days || [false, false, false, false, false, false, false])
      setOpeningHour(workspace.opening_hour)
      setClosingHour(workspace.closing_hour)
      setSpaceType(workspace.spaceType)
    }
  }, [workspace]);

  const checkUserValidation = () => {
    let errors = "";
    let isFormValid = true;

    //Name
    if (!name) {
      isFormValid = false;
      errors = errors + " name cannot be empty ";
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
        space_type_id: spaceType.id,
        photo,
        opening_days,
        opening_hour,
        closing_hour
      };

      if (isInCreateMode) {
        axios
        .post("http://localhost:8000/workspaces/create", query, {
          headers: {
            token,
          },
        })
        .then((res) => {
          console.log("success");
          navigate('/my-spaces');
        })
        .catch((err) => {
          alert(err.response.data);
        });
      } else {
        axios
        .put(`http://localhost:8000/workspaces/edit/${workspace.id}`, query, {
          headers: {
            token,
          },
        })
        .then((res) => {
          console.log("success");
          navigate('/my-spaces');
        })
        .catch((err) => {
          alert(err.response.data);
        });
      }
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
       <div className={'mt-8 text-3xl text-zinc-200'}>{workspace ? `Edit Workspace` : 'Create new Workspace'}</div>
       <OutlinedInput
        id="name"
        autoComplete="name"
        required
        fullWidth
        sx={{color:'white'}}
        className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
        placeholder="name"
        value={name}
        onChange={(event) => setName(event.target.value)}/>
        <OutlinedInput
          id="city"
          autoComplete="city"
          required
          fullWidth
          sx={{color:'white'}}
          className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
          name="city"
          placeholder="city"
          type="city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <OutlinedInput
          required
          fullWidth
          name="address"
          placeholder="address"
          sx={{color:'white'}}
          className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
          type="address"
          id="address"
          autoComplete="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
        <OutlinedInput
          required
          fullWidth
          sx={{color:'white'}}
          className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
          name="description"
          placeholder="description"
          type="description"
          id="description"
          autoComplete="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <OutlinedInput
          variant="outlined"
          sx={{color:'white'}}
          className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
          required
          fullWidth
          name="capacity"
          placeholder="capacity"
          type="capacity"
          id="capacity"
          autoComplete="capacity"
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
        />
        <OutlinedInput
          variant="outlined"
          sx={{color:'white'}}
          className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
          required
          fullWidth
          name="cost per hour"
          placeholder="how much do you take per hour?"
          type="cost per hour"
          id="cost per hour"
          autoComplete="cost per hour"
          value={cost_per_hour}
          onChange={(event) => setCostPerHour(event.target.value)}
        />
        <a className="text-zinc-400">Do you have any from the next:</a>
        <div className="all-checkbox">
        <div className="single-checkbox">
        <a className="text-zinc-400">wifi</a>
        <Checkbox
          checked={wifi}
          onChange={handleChangeIsWifi}
          inputProps={{ "aria-label": "controlled" }}
        />
        </div>
        <div className="single-checkbox">
        <a className="text-zinc-400">disabled access</a>
        <Checkbox
          checked={disabled_access}
          onChange={handleChangeDisabledAccess}
          inputProps={{ "aria-label": "controlled" }}
        />
        </div>
        <div className="single-checkbox">
        <a className="text-zinc-400">smoke friendly</a>
        <Checkbox
          checked={smoke_friendly}
          onChange={HandleChangeSmokeFriendly}
          inputProps={{ "aria-label": "controlled" }}
        />
        </div>
        </div>
        <div className="mb-6">
          <label htmlFor="environment"
                 className="block mb-2 text-sm font-medium text-zinc-400">
            Environment:
          </label>
          <Autocomplete
              id="environment"
              options={spaceTypes}
              getOptionLabel={option => option.name}
              className="w-64 block shadow-sm-light bg-zinc-700 border
                               border-zinc-600 rounded-lg"
              renderInput={(params =>
                      <TextField
                          variant="outlined"
                          value={spaceType}
                          {...params} />
              )}
              onChange={(event, value) => setSpaceType(value)}
          />
        </div>
        <a className="text-zinc-400">set opening days</a>
        <div className="all-checkbox">
          {daysCheckBox.map((day, index) => {
            return <div key={index} className="single-checkbox">
              <a className="text-zinc-400">{day.dayName}</a>
              <Checkbox
                checked={opening_days[index]}
                id={index.toString()}
                onChange={HandleChangeOpeningDays}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          })}
        </div>
        <a className="text-zinc-400">set hours</a>
          <a className="text-zinc-400">opening hour</a>
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
          className="text-white 2xl:text-lg text-sm bg-blue-600 hover:bg-blue-700 focus:ring-4
                          focus:outline-none focus:ring-blue-800 font-medium rounded-lg
                          px-5 py-2.5 text-center"
        >
          Save
        </Button>
      </Box>
    </Container>
  );
};

WorkspaceHandler.propTypes = {
  workspace: PropTypes.object,
};

export default WorkspaceHandler;
