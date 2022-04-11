import React from "react";
import WorkspacesList from "./WorkspacesList";
import WorkspacesToolbar from "./WorkspacesToolbar";

const WorkspacesSearchData = ({ setMapMarkers, hoveredMarkerId, setHoveredWorkspaceId }) => {
  return (
    <div className={"flex-1 flex flex-col"}>
      <div className={"h-20 mt-8"}>
        <WorkspacesToolbar />
      </div>
      <div className={"flex-1"}>
        <WorkspacesList
          setMapMarkers={setMapMarkers}
          hoveredMarkerId={hoveredMarkerId}
          setHoveredWorkspaceId={setHoveredWorkspaceId}
        />
      </div>
    </div>
  );
};

export default WorkspacesSearchData;
