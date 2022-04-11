import React, { useEffect, useState } from "react";
import WorkspacesListItem from "./WorkspacesListItem";
import Axios from "axios";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useLocation } from "react-router-dom";

const WorkspacesList = ({ setMapMarkers, hoveredMarkerId, setHoveredWorkspaceId }) => {
  const [workspaces, setWorkspaces] = useState([]);

  const workspaceParams = useLocation();

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
        params: workspaceParams.state,
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.log(`Failed to fetch workspaces ${err.message}`);
    }
  }, []);

  return (
    <div className={"flex h-full"}>
      <FormGroup
        className={"flex flex-col text-white px-8 pt-6 bg-zinc-400/30 rounded-tr-lg h-full"}
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
      <div className={"text-white flex flex-col flex-1 px-12"}>
        {filteredWorkspaces.map((workspace) => (
          <WorkspacesListItem
            key={workspace.id}
            workspace={workspace}
            hoveredOnMap={workspace.id == hoveredMarkerId}
            setHoveredWorkspaceId={setHoveredWorkspaceId}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkspacesList;
