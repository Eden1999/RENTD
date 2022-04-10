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
  const [workspace, setWorkspace] = useState({
    name: "",
    host_id: user.host_id,
    city: "",
    address: "",
    cost_per_hour: 10,
    capacity: 20,
    wifi: true,
    disabled_access: true,
    smoke_friendly: true,
    location_x: 1.0,
    location_y: 1.0,
    description: "",
    photo: "",
    spaceType: {id:1,name:''},
    opening_days: [false, false, false, false, false, false, false],
    opening_hour: '10:00',
    closing_hour: '23:00',
    spaceTypes: [{id:1,name:''}]
  });
  const [isInCreateMode, setIsInCreateMode] = useState(true) 
  const [location_x, setLocationX] = useState(1.0);
  const [location_y, setLocationY] = useState(1.0);
  const { token } = useToken();
  const [spaceTypes, setSpaceTypes] = useState([{id:1,name:''}]);

  useEffect(() => {
    console.log('hey')
    const workspace = _.get(location, 'state.workspace')

    if (!_.isEmpty(workspace)) {
      setWorkspace(workspace)
      setIsInCreateMode(false)
    }
  }, [location, spaceTypes]);

  // Get space types from the server to the environment selector
  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get("http://localhost:8000/spacetypes", query);
      setSpaceTypes(res.data);
      setWorkspace(workspace => ({...workspace, spaceType: res.data[0]}))
    } catch (err) {
      console.log(`Failed to fetch spaceTypes ${err.message}`);
    }
  }, []);

  const checkUserValidation = () => {
    let errors = "";
    let isFormValid = true;

    //Name
    if (!workspace.name) {
      isFormValid = false;
      errors = errors + " name cannot be empty ";
      setErrorMessage(errors);
    }

    return isFormValid;
  };

  const handleSave = useCallback(async () => {
    if (checkUserValidation()) {

      workspace.space_type_id = workspace.spaceType.id
      if (isInCreateMode) {
        axios
        .post("http://localhost:8000/workspaces/create", {workspace}, {
          headers: {
            token,
          },
        })
        .then((res) => {
          console.log("success");
          navigate('/my-spaces');
          // navigate(-1)
        })
        .catch((err) => {
          alert(err.response.data);
        });
      } else {
        axios
        .put(`http://localhost:8000/workspaces/edit/${workspace.id}`, {workspace}, {
          headers: {
            token,
          },
        })
        .then(() => {
          console.log("success");
          navigate('/my-spaces');
          // navigate(-1, { state: { workspace }, replace: true })
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
    setWorkspace(workspace => ({...workspace, wifi: !workspace.wifi}))
  };

  const setOpeningHour = (value) => {
    setWorkspace(workspace => ({...workspace, opening_hour: value}))
  }

  const setClosingHour = (value) => {
    setWorkspace(workspace => ({...workspace, closing_hour: value}))
  }

  const handleChangeDisabledAccess = () => {
    setWorkspace(workspace => ({...workspace, disabled_access: !workspace.disabled_access}))
  };

  const HandleChangeSmokeFriendly = () => {
    setWorkspace(workspace => ({...workspace, smoke_friendly: !workspace.smoke_friendly}))
  };

  const HandleChangeOpeningDays = ({target: {checked, id}}) => {
    let newArray = [...workspace.opening_days]
    newArray[id] = checked
    setWorkspace(workspace => ({...workspace, opening_days: newArray}))
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
    setWorkspace(workspace => ({...workspace, photo: base64Photo}))
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
       <div className={'mt-8 text-3xl text-zinc-200'}>{isInCreateMode ? 'Create new Workspace' : `Edit Workspace`}</div>
       <OutlinedInput
        id="name"
        autoComplete="name"
        required
        fullWidth
        sx={{color:'white'}}
        className="block shadow-sm-light bg-zinc-700 border
                    border-zinc-600 rounded-lg mb-6"
        placeholder="name"
        value={workspace.name}
        onChange={(event) => {
          setWorkspace(workspace => ({...workspace, name: event.target.value}))
        }}/>
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
          value={workspace.city}
          onChange={(event) => {
            setWorkspace(workspace => ({...workspace, city: event.target.value}))
          }}
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
          value={workspace.address}
          onChange={(event) => {
            setWorkspace(workspace => ({...workspace, address: event.target.value}))
          }}
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
          value={workspace.description}
          onChange={(event) => {
            setWorkspace(workspace => ({...workspace, description: event.target.value}))
          }}
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
          value={workspace.capacity}
          onChange={(event) => {
            setWorkspace(workspace => ({...workspace, capacity: event.target.value}))
          }}
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
          value={workspace.cost_per_hour}
          onChange={(event) => {
            setWorkspace(workspace => ({...workspace, cost_per_hour: event.target.value}))
          }}
        />
        <a className="text-zinc-400">Do you have any from the next:</a>
        <div className="all-checkbox">
        <div className="single-checkbox">
        <a className="text-zinc-400">wifi</a>
        <Checkbox
          checked={workspace.wifi}
          onChange={handleChangeIsWifi}
          inputProps={{ "aria-label": "controlled" }}
        />
        </div>
        <div className="single-checkbox">
        <a className="text-zinc-400">disabled access</a>
        <Checkbox
          checked={workspace.disabled_access}
          onChange={handleChangeDisabledAccess}
          inputProps={{ "aria-label": "controlled" }}
        />
        </div>
        <div className="single-checkbox">
        <a className="text-zinc-400">smoke friendly</a>
        <Checkbox
          checked={workspace.smoke_friendly}
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
                          {...params} />
              )}
              value={workspace.spaceType}
              onChange={(event, value) => 
                {setWorkspace(workspace => ({...workspace, spaceType: value}))}
              }
          />
        </div>
        <a className="text-zinc-400">set opening days</a>
        <div className="all-checkbox">
          {daysCheckBox.map((day, index) => {
            return <div key={index} className="single-checkbox">
              <a className="text-zinc-400">{day.dayName}</a>
              <Checkbox
                checked={workspace.opening_days[index]}
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
            value={workspace.opening_hour}/>
          <TimePicker
            onChange={setClosingHour}
            value={workspace.closing_hour}/>
        <input
          type="file"
          label="Photo"
          name="photo"
          accept=".jpeg, .png, .jpg"
          onChange={handlePhotoUpload}
        />
        <div className="photo-preview">
          <img src={workspace.photo} />
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
