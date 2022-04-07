import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import {Link} from "react-router-dom";

const WorkspacesListItem = ({ workspace }) => {
  const navigate = useNavigate();

  const onItemClick = useCallback((e, workspace) => {
    navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
  }, []);

  const onEditClick = useCallback((e, workspace) => {
    navigate(`/manage/editWorkspace`, { state: { workspace } });
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }, []);

  return (
    <div
      className={`flex bg-zinc-500 hover:bg-zinc-500/90 transition-all duration-200 rounded-lg p-3
            hover:cursor-pointer mt-5    
        `}
      //   className={`item ${
      //     hoveredMarker === workspace.id || hoveredWorkspaceId === workspace.id ? "hover" : ""
      //   }`}
      //   onMouseEnter={() => onItemHover(workspace.id)}
      //   onMouseLeave={onItemStopHover}
      id="listItem"
      onClick={(e) => onItemClick(e, workspace)}
    >
      <img src={workspace.photo} className={"h-28 w-48 bg-zinc-400 rounded-md"} />
      <div className={"flex flex-col text-left flex-1 ml-8"}>
        <span className={"text-xl text-zinc-100"}>{workspace.name}</span>
        <span>
        {/* <Link to={'/manage/newWorkspace'}> */}
          <IconButton id="editIcon" aria-label="edit workspace" color='primary' onClick={(e) => onEditClick(e, workspace)}>
            <EditIcon />
          </IconButton>
        {/* </Link> */}
          {/* <IconButton color="primary" aria-label="edit workspace" component="span">
            <EditIcon />
          </IconButton> */}
        </span>
        <span className={"text-sm text-zinc-300 mt-1.5"}>
          {workspace.address}, {workspace.city}
        </span>
        <span className={"mt-auto text-xs text-zinc-300"}>
          Opens: {workspace.opening_hour} - {workspace.closing_hour}
        </span>
      </div>
    </div>
  );
};

export default WorkspacesListItem;
