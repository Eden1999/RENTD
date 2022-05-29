import React, { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppContext } from "../store/AppContext";
import axios from "axios";
import useToken from "../helpers/useToken";

const WorkspacesListItem = ({
  workspace,
  isEditable,
  onDelete,
  hoveredOnMap,
  setHoveredWorkspaceId,
}) => {
  const navigate = useNavigate();
  const [{ user }] = useContext(AppContext);
  const { token, setToken } = useToken();
  const [, dispatch] = useContext(AppContext);

  const onItemClick = useCallback((e, workspace) => {
    navigate(`/workspaces/${workspace.id}`, { state: { workspace, isEditable } });
  }, []);

  const onEditClick = useCallback((e, workspace) => {
    navigate(`/manage/editWorkspace`, { state: { workspace } });
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }, []);

  const onDeleteClick = useCallback((e, workspace) => {
    axios
      .delete(`http://localhost:8000/workspaces/${workspace.id}`, {
        headers: {
          token,
        },
      })
      .then((res) => {
        onDelete(workspace.id);
        navigate("/my-spaces");
      })
      .catch((err) => {
        alert(err.response.data);
      });

    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }, []);

  const onItemHover = useCallback(
    (workspaceId) => {
      setHoveredWorkspaceId(workspaceId);
    },
    [setHoveredWorkspaceId]
  );

  const onItemStopHover = useCallback(() => {
    setHoveredWorkspaceId(null);
  }, [setHoveredWorkspaceId]);

  return (
    <div
      className={`flex bg-zinc-500 hover:bg-zinc-500/90 transition-all duration-200 rounded-lg p-3
            hover:cursor-pointer mt-5 ${hoveredOnMap ? "hover" : ""}  
        `}
      onMouseEnter={() => onItemHover(workspace.id)}
      onMouseLeave={onItemStopHover}
      id="listItem"
      onClick={(e) => onItemClick(e, workspace)}
    >
      <img src={workspace.photo} className={"h-28 w-48 bg-zinc-400 rounded-md"} />
      <div className={"flex flex-col text-left flex-1 ml-8"}>
        <span className={"text-xl text-zinc-100"}>{workspace.name}</span>
        <span className={"text-md text-zinc-300 mt-1.5"}>
          {workspace.address}, {workspace.city}
        </span>
        <span className={"mt-auto text-sm text-zinc-300"}>
          Opens: {workspace.opening_hour} - {workspace.closing_hour}
        </span>
      </div>
      <div className="flex">
        {isEditable && (
            <span className="flex self-center">
              <button className="btn btn-sm btn-circle"
                      onClick={(e) => onEditClick(e, workspace)}>
                <EditIcon htmlColor="#4AA0D5"/>
              </button>
            <button className="btn btn-sm btn-circle mx-4"
                onClick={(e) => onDeleteClick(e, workspace)}
            >
              <DeleteIcon htmlColor="#EB586F"/>
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkspacesListItem;
