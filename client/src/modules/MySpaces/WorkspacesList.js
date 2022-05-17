import React, { useContext, useEffect, useState, useCallback } from "react";
import WorkspacesListItem from "../../components/WorkspacesListItem";
import Axios from "axios";
import { AppContext } from "../../store/AppContext";

const WorkspacesList = ({ isEditable, setMapMarkers, hoveredMarkerId, setHoveredWorkspaceId }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [{ user }] = useContext(AppContext);

  const onDelete = (id) => {
    setWorkspaces((workspaces) => {
      let newArray = workspaces;
      workspaces = newArray.filter((obj) => obj.id !== id);
      return workspaces;
    });
  };

  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get(`http://localhost:8000/workspaces/hosts/${user.id}`);
      setWorkspaces(res.data);
      setMapMarkers(res.data);
    } catch (err) {
      console.log(`Failed to fetch workspaces ${err.message}`);
    }
  }, []);

  return (
    <div className={"text-white flex flex-col flex-1"}>
      {workspaces &&
        workspaces.map((workspace) => (
          <WorkspacesListItem
            workspace={workspace}
            key={workspace.id}
            onDelete={onDelete}
            isEditable={isEditable}
            hoveredOnMap={workspace.id == hoveredMarkerId}
            setHoveredWorkspaceId={setHoveredWorkspaceId}
          />
        ))}
    </div>
  );
};

export default WorkspacesList;