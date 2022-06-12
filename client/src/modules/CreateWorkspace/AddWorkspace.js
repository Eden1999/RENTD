import React, { useState, useCallback, useContext, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../../store/AppContext";
import useToken from "../../helpers/useToken";
import "./AddWorkspace.scss";
import "./AddWorkspace.scss";
import BasicInfoForm from "./BasicInfoForm";
import _ from "lodash";
import Axios from "axios";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import TagsForm from "./TagsForm";
import OpenDaysForm from "./OpenDaysForm";
import UploadImages from "./UploadImages";
import AddAssets from "./AddAssets";

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
  const [cityBounds, setCityBounds] = useState({});
  const { token } = useToken();
  const [spaceTypes, setSpaceTypes] = useState([{ id: 1, name: "" }]);
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
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}/spacetypes`, query);
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

  const handleImageDelete = (index) => {
    let newArray = [...workspace.photos];
    newArray.splice(index, 1);
    setWorkspace((workspace) => ({ ...workspace, photos: newArray }));
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
            `${process.env.REACT_APP_SERVER_URL}/workspaces/create`,
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
            `${process.env.REACT_APP_SERVER_URL}/workspaces/edit/${workspace.id}`,
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

    setWorkspace((workspace) => ({
      ...workspace,
      photos: [...workspace.photos, ...filesToAdd],
    }));
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
        const autoComplete = new window.google.maps.places.Autocomplete(locationInput, options);
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
        const autoComplete = new window.google.maps.places.Autocomplete(addressInput, options);
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
          <div className="text-left pl-44 pr-44 mt-5">
            <BasicInfoForm
              editProps={editProps}
              setWorkspace={setWorkspace}
              spaceTypes={spaceTypes}
              workspace={workspace}
            ></BasicInfoForm>
          </div>
        );
      case 1:
        return (
          <div className="mt-10 pl-44 pr-44 text-center">
            <a className="text-primary text-2xl font-medium">
              Do you have any of the following in the workspace?
            </a>
            <TagsForm
              HandleChangeSmokeFriendly={HandleChangeSmokeFriendly}
              handleChangeDisabledAccess={handleChangeDisabledAccess}
              handleChangeIsWifi={handleChangeIsWifi}
              workspace={workspace}
            />
          </div>
        );
      case 2:
        return (
          <div className="mt-10 pl-44 pr-44 text-center">
            <a className="text-primary text-2xl font-medium mb-10">
              What days and hours will your workspace be open?
            </a>
            <OpenDaysForm
              HandleChangeOpeningDays={HandleChangeOpeningDays}
              handleClosingHour={handleClosingHour}
              handleOpeningHour={handleOpeningHour}
              workspace={workspace}
            />
          </div>
        );
      case 3:
        return (
          <div className="mb-6 pl-44 pr-44 mt-10 text-center h-screen">
            <a className="text-primary text-2xl font-medium">
              Choose images to show your space, please select at least 5
            </a>
            <UploadImages
              workspace={workspace}
              handlePhotoUpload={handlePhotoUpload}
              handleImageDelete={handleImageDelete}
            />
          </div>
        );
      case 4:
        return (
          <div className="mb-6 pl-44 pr-44 mt-10 text-center h-screen">
            <a className="text-primary text-2xl font-medium">Add your workspace rooms and tables</a>
            <AddAssets
              handleChangeAsset={handleChangeAsset}
              handleDeleteAsset={handleDeleteAsset}
              onAddAssetClick={onAddAssetClick}
              workspace={workspace}
            />
          </div>
        );
      default:
        return "foo";
    }
  }

  return isInCreateMode ? (
    <div>
      <ul className="steps steps-vertical lg:steps-horizontal w-full mt-5">
        <li
          className={`step step-primary`}
          onClick={() => {
            setStep(0);
          }}
        >
          Basic details
        </li>
        <li
          className={`step ${step >= 1 && "step-primary"}`}
          onClick={() => {
            setStep(1);
          }}
        >
          Facilities
        </li>
        <li
          className={`step ${step >= 2 && "step-primary"}`}
          onClick={() => {
            setStep(2);
          }}
        >
          Open days & hours
        </li>
        <li
          className={`step ${step >= 3 && "step-primary"}`}
          onClick={() => {
            setStep(3);
          }}
        >
          Images
        </li>
        <li
          className={`step ${step >= 4 && "step-primary"}`}
          onClick={() => {
            setStep(4);
          }}
        >
          Assets
        </li>
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
  ) : (
    <div className="text-center">
      <ul className="steps steps-vertical lg:steps-horizontal w-full mt-5">
        <li
          className={`step ${step === 0 ? "step-primary" : ""}`}
          onClick={() => {
            setStep(0);
          }}
        >
          Basic details
        </li>
        <li
          className={`step ${step === 1 ? "step-primary" : ""}`}
          onClick={() => {
            setStep(1);
          }}
        >
          Facilities
        </li>
        <li
          className={`step ${step === 2 ? "step-primary" : ""}`}
          onClick={() => {
            setStep(2);
          }}
        >
          Open days & hours
        </li>
        <li
          className={`step ${step === 3 ? "step-primary" : ""}`}
          onClick={() => {
            setStep(3);
          }}
        >
          Images
        </li>
        <li
          className={`step ${step === 4 ? "step-primary" : ""}`}
          onClick={() => {
            setStep(4);
          }}
        >
          Assets
        </li>
      </ul>
      {renderSwitch()}
      <button className="btn btn-lg btn-primary sticky bottom-5" onClick={handleSave}>
        Edit workspace
      </button>
    </div>
  );
};

AddWorkspace.propTypes = {
  workspace: PropTypes.object,
};

export default AddWorkspace;
