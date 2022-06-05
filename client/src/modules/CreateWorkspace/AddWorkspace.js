import React, { useState, useCallback, useContext, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../../store/AppContext";
import useToken from "../../helpers/useToken";
import { Link } from "react-router-dom";
import "./CreateWorkspace.scss";
import "./AddWorkspace.scss";
import { Wifi, SmokingRooms, Accessible, Add } from "@mui/icons-material";
import AddAsset from "./AddAsset";
import _ from "lodash";
import TimePicker from "react-time-picker";
import Axios from "axios";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

const daysCheckBox = [
  { dayName: "sunday" },
  { dayName: "monday" },
  { dayName: "tuesday" },
  { dayName: "wednesday" },
  { dayName: "thursday" },
  { dayName: "friday" },
  { dayName: "saturday" },
];

const AddWorkspace = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const [{ user }] = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("erros: ");
  const [workspace, setWorkspace] = useState({
    name: "",
    host_id: user.host_id,
    city: "",
    address: "",
    wifi: false,
    disabled_access: false,
    smoke_friendly: false,
    location_x: 1.0,
    location_y: 1.0,
    description: "",
    photos: [],
    spaceType: { id: 1, name: "" },
    opening_days: [
      { open: false },
      { open: false },
      { open: false },
      { open: false },
      { open: false },
      { open: false },
      { open: false },
    ],
    spaceTypes: [{ id: 1, name: "" }],
    assets: [],
  });
  const [isInCreateMode, setIsInCreateMode] = useState(true);
  const [location_x, setLocationX] = useState(1.0);
  const [location_y, setLocationY] = useState(1.0);
  const [cityBounds, setCityBounds] = useState({});
  const { token } = useToken();
  const [spaceTypes, setSpaceTypes] = useState([{ id: 1, name: "" }]);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [editProps, setEditProps] = useState({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    const workspace = _.get(location, "state.workspace");

    if (!_.isEmpty(workspace)) {
      setWorkspace(workspace);
      setIsInCreateMode(false);
      setEditProps({
        ...editProps,
        city: { key: workspace.city, defaultValue: workspace.city },
        address: { key: workspace.address, defaultValue: workspace.address },
      });
    }
  }, [location, spaceTypes]);

  // Get space types from the server to the environment selector
  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get("http://localhost:8000/spacetypes", query);
      setSpaceTypes(res.data);
      setWorkspace((workspace) => ({ ...workspace, spaceType: res.data[0] }));
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

  const handleChangeAsset = (asset, index) => {
    let newArray = [...workspace.assets];
    newArray[index] = asset;
    setWorkspace((workspace) => ({ ...workspace, assets: newArray }));
  };

  const handleDeleteAsset = (index) => {
    let newArray = [...workspace.assets];
    newArray.splice(index, 1);
    setWorkspace((workspace) => ({ ...workspace, assets: newArray }));
  };

  const handleSave = useCallback(async () => {
    if (checkUserValidation()) {
      workspace.space_type_id = workspace.spaceType.id;
      if (isInCreateMode) {
        axios
          .post(
            "http://localhost:8000/workspaces/create",
            { workspace },
            {
              headers: {
                token,
              },
            }
          )
          .then((res) => {
            console.log("success");
            navigate("/my-spaces");
            // navigate(-1)
          })
          .catch((err) => {
            alert(err.response.data);
          });
      } else {
        axios
          .put(
            `http://localhost:8000/workspaces/edit/${workspace.id}`,
            { workspace },
            {
              headers: {
                token,
              },
            }
          )
          .then(() => {
            console.log("success");
            navigate("/my-spaces");
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
    setWorkspace((workspace) => ({ ...workspace, wifi: !workspace.wifi }));
  };

  const handleOpeningHour = (index, value) => {
    let newArray = [...workspace.opening_days];
    newArray[index].opening_hour = value;
    setWorkspace((workspace) => ({ ...workspace, opening_days: newArray }));
  };

  const handleClosingHour = (index, value) => {
    let newArray = [...workspace.opening_days];
    newArray[index].closing_hour = value;
    setWorkspace((workspace) => ({ ...workspace, opening_days: newArray }));
  };

  const handleChangeDisabledAccess = () => {
    setWorkspace((workspace) => ({
      ...workspace,
      disabled_access: !workspace.disabled_access,
    }));
  };

  const HandleChangeSmokeFriendly = () => {
    setWorkspace((workspace) => ({
      ...workspace,
      smoke_friendly: !workspace.smoke_friendly,
    }));
  };

  const HandleChangeOpeningDays = ({ target: { checked, id } }) => {
    let newArray = [...workspace.opening_days];
    newArray[id].open = checked;
    setWorkspace((workspace) => ({ ...workspace, opening_days: newArray }));
  };

  const onAddAssetClick = useCallback(async (e) => {
    console.log("hey");
    let newArray = [...workspace.assets];
    let asset = {
      capacity: 2,
      cost_per_hour: 20,
      asset_id: "1",
      text: "Room",
    };
    newArray.push(asset);
    setWorkspace((workspace) => ({ ...workspace, assets: newArray }));
  });

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
    let filesToAdd = [];
    let base64Photo;

    for (const file of e.target.files) {
      base64Photo = await convertToBase64(file);
      filesToAdd.push(base64Photo);
    }

    setWorkspace((workspace) => ({ ...workspace, photos: [...workspace.photos, ...filesToAdd] }));
  };

  useEffect(async () => {
    try {
      const locationInput = document.getElementById("city");
      const options = {
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
        types: ["locality"],
      };
      setTimeout(() => {
        const autoComplete = new window.google.maps.places.Autocomplete(
          locationInput,
          options
        );
        autoComplete.addListener("place_changed", () => {
          const place = autoComplete.getPlace();
          setCityBounds(place.geometry.viewport);
          setWorkspace((workspace) => ({
            ...workspace,
            city: place.name,
            address: "",
          }));
          document.getElementById("address").value = "";
        });
      }, 1000);
    } catch (err) {
      console.log(`Failed to fetch cities autocompletion: ${err.message}`);
    }
  }, [editProps]);

  useEffect(async () => {
    try {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.union(cityBounds);
      const addressInput = document.getElementById("address");
      const options = {
        bounds,
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: true,
        types: ["address"],
      };
      setTimeout(() => {
        const autoComplete = new window.google.maps.places.Autocomplete(
          addressInput,
          options
        );
        autoComplete.addListener("place_changed", () => {
          const place = autoComplete.getPlace();
          setWorkspace((workspace) => ({
            ...workspace,
            address: place.name,
            location_y: place.geometry.location.lat(),
            location_x: place.geometry.location.lng(),
          }));
        });
      }, 0);
    } catch (err) {
      console.log(`Failed to fetch addresses autocompletion: ${err.message}`);
    }
  }, [workspace.city]);

  function renderSwitch() {
    switch (step) {
      case 0:
        return (
          <div className="pl-44 pr-44 mt-5 h-screen">
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Name:
              </label>
              <input
                className="input input-bordered select-lg font-normal w-full text-secondary"
                value={workspace.name}
                onChange={(event) => {
                  setWorkspace((workspace) => ({
                    ...workspace,
                    name: event.target.value,
                  }));
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                City:
              </label>
              <input
                className="input input-bordered select-lg font-normal w-full text-secondary"
                type="city"
                id="city"
                {...editProps.city}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Address:
              </label>
              <input
                className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                type="address"
                id="address"
                disabled={!workspace.city}
                {...editProps.address}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Description:
              </label>
              <textarea
                className="textarea textarea-bordered 2xl:select-lg font-normal w-full text-secondary"
                value={workspace.description}
                onChange={(event) => {
                  setWorkspace((workspace) => ({
                    ...workspace,
                    description: event.target.value,
                  }));
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Environment:
              </label>
              <select
                className="select select-bordered select-lg mb-2 font-medium w-full text-primary"
                onChange={(event, value) => {
                  setWorkspace((workspace) => ({
                    ...workspace,
                    spaceType: value,
                  }));
                }}
              >
                {spaceTypes.map((item, index) => (
                  <option value={index} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="mt-10 pl-44 pr-44 text-center h-screen">
            <a className="text-primary text-2xl font-medium">
              Do you have any of the following in the workspace?
            </a>
            <div className="flex flex-row justify-center mt-20">
              <div
                className={`label cursor-pointer flex flex-column justify-center w-40 h-40 border-indigo-400
                     ${workspace.wifi ? "border-2" : "border"} rounded-lg`}
                onClick={handleChangeIsWifi}
              >
                <Wifi />
                <span className="label-text font-medium text-primary">
                  wifi
                </span>
              </div>
              <div
                className={`label cursor-pointer flex flex-column justify-center w-40 h-40 border-indigo-400
                     ${
                       workspace.disabled_access ? "border-2" : "border"
                     } ml-10 rounded-lg`}
                onClick={handleChangeDisabledAccess}
              >
                <Accessible />
                <span className="label-text font-medium text-primary">
                  disabled access
                </span>
              </div>
              <div
                className={`label cursor-pointer flex flex-column justify-center w-40 h-40 border-indigo-400
                     ${
                       workspace.smoke_friendly ? "border-2" : "border"
                     } ml-10 rounded-lg`}
                onClick={HandleChangeSmokeFriendly}
              >
                <SmokingRooms />
                <span className="label-text font-medium text-primary">
                  smoke friendly
                </span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="mt-10 pl-44 pr-44 text-center h-screen">
            <a className="text-primary text-2xl font-medium mb-10">
              What days and hours will your workspace be open?
            </a>
            <div className="pt-10">
            {daysCheckBox.map((day, index) => {
              return (
                <div key={day.dayName}>
                  <label className="label cursor-pointer">
                    <a className="label-text text-primary text-lg font-medium">
                      {day.dayName}
                    </a>
                    <input
                      type="checkbox"
                      checked={workspace.opening_days[index].open}
                      id={index.toString()}
                      onChange={HandleChangeOpeningDays}
                      className="checkbox checkbox-primary"
                    />
                  </label>

                  {workspace.opening_days[index].open && (
                    <label className="label cursor-pointer justify-start">
                      <a className="label-text font-medium text-secondary text-base">
                        opening hours:
                      </a>
                      <div className="ml-5">
                        <TimePicker
                          onChange={(value) => handleOpeningHour(index, value)}
                          value={workspace.opening_days[index].opening_hour}
                        />{" "}
                        -
                        <TimePicker
                          onChange={(value) => handleClosingHour(index, value)}
                          value={workspace.opening_days[index].closing_hour}
                        />
                      </div>
                    </label>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="mb-6 pl-44 pr-44 mt-10 text-center h-screen">
            <a className="text-primary text-2xl font-medium">
              Choose images to show your space, please select at least 5
            </a>
            <div className="flex flex-row flex-wrap justify-center mt-10">
            {workspace.photos?.map((photo) => {
              return <img
                className="mask w-44 h-44 mb-2 mr-5"
                src={photo}
              />
            })}
            </div>

            <input
              id="photos"
              type="file"
              label="Photo"
              name="photo"
              multiple="multiple"
              accept=".jpeg, .png, .jpg"
              onChange={handlePhotoUpload}
              hidden
            />
            <label htmlFor="photos" id="button" class="mt-10 rounded-sm px-3 py-1 btn btn-primary hover:bg-gray-300 focus:shadow-outline focus:outline-none">
              Upload photos
            </label>
          </div>
        );
      case 4:
        return (
          <div className="mb-6 pl-44 pr-44 mt-10 text-center h-screen">
            <a className="text-primary text-2xl font-medium">
              Add your workspace rooms and tables
            </a>
            <div className="flex flex-row text-center flex-wrap">
              {workspace.assets &&
                workspace.assets.map((curAsset, index) => {
                  return (
                    <AddAsset
                      asset={curAsset}
                      handleChange={handleChangeAsset}
                      index={index}
                      handleDelete={handleDeleteAsset}
                    />
                  );
                })}
              <div className="flex items-center">
                <button className="btn btn-circle" onClick={onAddAssetClick}>
                  <Add />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return "foo";
    }
  }

  return (
    <div>
      <ul class="steps steps-vertical lg:steps-horizontal w-full mt-5">
        <li class={`step step-primary`}>Basic details</li>
        <li class={`step ${step >= 1 && "step-primary"}`}>Facilities</li>
        <li class={`step ${step >= 2 && "step-primary"}`}>Open days & hours</li>
        <li class={`step ${step >= 3 && "step-primary"}`}>Images</li>
        <li class={`step ${step >= 4 && "step-primary"}`}>Assets</li>
      </ul>
      {renderSwitch()}
      {step !== 0 && (
        <button
          className="btn btn-lg btn-primary ml-20 sticky bottom-5 left-0"
          onClick={() => {
            setStep((step) => step - 1);
          }}
        >
          Back
        </button>
      )}
      <button
        className="btn btn-lg btn-primary mr-20 sticky bottom-5 float-right"
        onClick={() => {
          step === 4 ? handleSave() : setStep((step) => step + 1);
        }}
      >
        {step === 4 ? "Create workspace" : "Next"}
      </button>
    </div>
  );
};

AddWorkspace.propTypes = {
  workspace: PropTypes.object,
};

export default AddWorkspace;
