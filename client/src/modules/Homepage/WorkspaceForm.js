import { LocationOn } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import NumberInput from "../../components/NumberInput";

function WorkspaceForm() {
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [city, setCity] = useState({});
  const [capacity, setCapacity] = useState(1);
  const [spaceType, setSpaceType] = useState({});
  const navigate = useNavigate();

  const handleValidations = () => {
    let isFormValid = true;

    if (!city?.name || capacity < 1) {
      isFormValid = false;
    }

    return isFormValid;
  };

  // Get space types from the server to the environment selector
  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get(
        `${process.env.REACT_APP_SERVER_URL}spacetypes`,
        query
      );
      setSpaceTypes(res.data);
      setSpaceType(res.data[0]);
    } catch (err) {
      console.log(`Failed to fetch spaceTypes ${err.message}`);
    }
  }, []);

  useEffect(async () => {
    try {
      const locationInput = document.getElementById("location");
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
          setCity({ name: place.name, location: place.geometry.location });
        });
      }, 1000);
    } catch (err) {
      console.log(`Failed to fetch cities autocompletion: ${err.message}`);
    }
  }, []);

  return (
    <form autoComplete="off">
      <div className="mb-6">
        <label
          htmlFor="location"
          className="block mb-2 text-lg font-medium text-primary"
        >
          Search for workspace at:
        </label>
        <div className="relative">
          <LocationOn className="absolute top-1/2 transform -translate-y-1/2 left-4 text-secondary" />
          <input
            id="location"
            type="text"
            placeholder="Tel Aviv"
            required
            className="input input-bordered 2xl:input-lg w-full pl-11 2xl:pl-11 text-secondary"
          />
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="environment"
          className="block mb-2 text-lg font-medium text-primary"
        >
          Environment:
        </label>
        <select
          className="select select-bordered 2xl:select-lg font-normal w-full text-secondary"
          onChange={(event) => setSpaceType(spaceTypes[event.target.value])}
          required
        >
          {spaceTypes.map((item, index) => (
            <option value={index} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-end mb-6">
        <div className="w-1/2">
          <label
            htmlFor="capacity"
            className="block mb-2 text-lg font-medium text-primary"
          >
            Number of people:
          </label>
          <NumberInput id="capacity" value={capacity} setValue={setCapacity} />
        </div>
        <div>
          <button
            type="submit"
            onClick={(e) => {
              if (handleValidations()) {
                navigate("/search", {
                  state: {
                    city: JSON.stringify(city),
                    capacity,
                    space_type_id: spaceType.id,
                  },
                });
              }
            }}
            className="btn btn-lg btn-primary"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default WorkspaceForm;
