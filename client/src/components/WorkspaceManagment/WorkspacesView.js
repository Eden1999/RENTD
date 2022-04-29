import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

import Map from "../Map/Map";

import WorkspacesSearchData from "./WorkspacesSearchData";

const WorkspacesView = () => {
  const [mapMarkers, setMapMarkers] = useState([]);
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const { state } = useLocation();
  let { city } = state;
  city = JSON.parse(city);

  const onMarkerHover = useCallback(
    (workspaceId) => {
      setHoveredMarkerId(workspaceId);
    },
    [setHoveredMarkerId]
  );

  return (
    <div className="h-full flex flex-row flex-1">
      <div className="flex w-1/2">
        <WorkspacesSearchData
          setMapMarkers={setMapMarkers}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredWorkspaceId={setHoveredWorkspaceId}
        />
      </div>
      <div className="flex flex-1 min-h-full mx-44 my-8">
        <div className="w-full">
          <Map
            onMarkerHover={onMarkerHover}
            hoveredMarkerId={hoveredWorkspaceId}
            center_location={city.location}
            markers={mapMarkers.map(({ id, location_x, location_y, cost_per_hour }) => ({
              id,
              lat: location_x,
              lng: location_y,
              text: cost_per_hour,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspacesView;
