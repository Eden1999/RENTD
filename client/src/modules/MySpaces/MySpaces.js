import { useState, useCallback } from "react";
import { Container, IconButton } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";

import WorkspacesList from "./WorkspacesList";
import Map from "../Map/Map";
const MySpaces = () => {
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
    <Container className="h-full">
      <div className="flex h-full">
        <div className="flex flex-1 flex-col mr-10">
          <div className="flex justify-between mt-8 text-3xl text-zinc-200">
            <span>My workspaces</span>
            <Link to={"/manage/newWorkspace"}>
              <IconButton aria-label="new workspace" color="primary">
                <AddCircleOutline />
              </IconButton>
            </Link>
          </div>
          <div className="flex mt-10">
            <WorkspacesList
              isEditable={true}
              setMapMarkers={setMapMarkers}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredWorkspaceId={setHoveredWorkspaceId}
            />
          </div>
        </div>
        <div className="flex flex-1 mt-8 min-h-full w-full">
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
    </Container>
  );
};

export default MySpaces;
