import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Map from "../Map/Map";

import WorkspacesSearchData from "./WorkspacesSearchData";

const WorkspacesView = () => {
  const navigate = useNavigate();
  const [mapMarkers, setMapMarkers] = useState([]);
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const onMarkerHover = useCallback(
    (workspaceId) => {
      setHoveredMarkerId(workspaceId);
    },
    [setHoveredMarkerId]
  );

  return (
    <div className={"h-full flex"}>
      <div className={"flex w-1/2"}>
        <WorkspacesSearchData
          setMapMarkers={setMapMarkers}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredWorkspaceId={setHoveredWorkspaceId}
        />
      </div>
      <div className={"flex flex-1"} style={{ minHeight: "100%" }}>
        <div className={"w-full h-full"}>
          <Map
            onMarkerHover={onMarkerHover}
            hoveredMarkerId={hoveredWorkspaceId}
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
