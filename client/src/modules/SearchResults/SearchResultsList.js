import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useLocation } from "react-router-dom";
import WorkspacesList from "../../components/WorkspacesList";
import {workspaceListType} from "../../helpers/consts";

const SearchResultsList = ({ setMapMarkers, hoveredMarkerId, setHoveredWorkspaceId }) => {
  const [workspaces, setWorkspaces] = useState([]);

  const { state } = useLocation();
  const { capacity, space_type_id } = state;
  let { city } = state;
  city = JSON.parse(city);

  const filters = {
    wifi: {
      value: "wifi",
      key: "wifi",
      label: "WiFi",
    },
    disabled_access: {
      value: "disabled_access",
      key: "disabled_access",
      label: "Disabled Access",
    },
    smoke_friendly: {
      value: "smoke_friendly",
      key: "smoke_friendly",
      label: "Smoke Friendly",
    },
  };
  const [checkedFilters, setCheckedItems] = useState({
    wifi: false,
    disabled_access: false,
    smoke_friendly: false,
  });
  const handleFilterChange = ({ target: { value, checked } }) => {
    setCheckedItems({ ...checkedFilters, [value]: checked });
  };

  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  useEffect(async () => {
    const newFilteredWorkspaces = workspaces.filter((workspace) => {
      let isFilteredIn = true;
      Object.entries(checkedFilters).forEach(([filterType, checked]) => {
        if (checked) {
          isFilteredIn &= workspace[filterType] === checked;
        }
      });

      return isFilteredIn;
    });

    setFilteredWorkspaces(newFilteredWorkspaces);
    setMapMarkers(newFilteredWorkspaces);
  }, [workspaces, checkedFilters]);

  useEffect(async () => {
    try {
      const res = await Axios.post(`${process.env.REACT_APP_SERVER_URL}/workspaces/search`, null, {
        params: { city: city.name, capacity, space_type_id },
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.log(`Failed to fetch workspaces ${err.message}`);
    }
  }, []);

  return (
    <div className={"h-full"}>
      <FormGroup sx={{ flexDirection: 'row' }} className={"w-2/5 flex mb-5 m-auto text-primary px-8 py-4 bg-secondary/30 rounded-lg"}>
        {Object.values(filters).map(({ label, value, key }) => (
          <div>
          <FormControlLabel
            label={label}
            key={key}
            control={
              <Checkbox
                value={value}
                checked={checkedFilters[value]}
                onChange={handleFilterChange}
              />
            }
          />
          </div>
        ))}
      </FormGroup>
      <div className={"w-full px-12"}>
        <WorkspacesList
          workspaces={filteredWorkspaces}
          workspaceCardBody={ workspaceListType.general}
          setMapMarkers={setMapMarkers}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredWorkspaceId={setHoveredWorkspaceId}
        />
      </div>
    </div>
  );
};

export default SearchResultsList;
