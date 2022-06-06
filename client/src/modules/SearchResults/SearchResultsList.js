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
      const res = await Axios.post("http://localhost:8000/workspaces/search", null, {
        params: { city: city.name, capacity, space_type_id },
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.log(`Failed to fetch workspaces ${err.message}`);
    }
  }, []);

  return (
    <div className={"flex h-full"}>
      <FormGroup
        className={"w-1/4 text-primary px-8 pt-6 bg-secondary/30 rounded-tr-lg h-full"}
      >
        {Object.values(filters).map(({ label, value, key }) => (
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
        ))}
      </FormGroup>
      <div className={"w-4/5 px-12"}>
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
