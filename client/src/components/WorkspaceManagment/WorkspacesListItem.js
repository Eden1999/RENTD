import React, { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from "react-router-dom";
import { AppContext } from "../../store/AppContext";
import axios from 'axios'
import useToken from "../../helpers/useToken";

const WorkspacesListItem = ({ workspace }) => {
  const navigate = useNavigate();
  const [{ user }] = useContext(AppContext);
  const { token, setToken } = useToken();
  const [ , dispatch] = useContext(AppContext)

  const onItemClick = useCallback((e, workspace) => {
    navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
  }, []);

  const onEditClick = useCallback((e, workspace) => {
    navigate(`/manage/editWorkspace`, { state: { workspace } });
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }, []);

  const onDeleteClick = useCallback((e, workspace) => {
    axios.delete(`http://localhost:8000/workspaces/${workspace.id}`, 
    {headers: {
      token,
    }},)
    .then((res) => {
      navigate('/my-spaces');
    })
    .catch(err =>{
        alert(err.response.data)
    })

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
        {user.is_host && (<span>
            <IconButton id="editIcon" aria-label="edit workspace" color='primary' onClick={(e) => onEditClick(e, workspace)}>
              <EditIcon />
            </IconButton>
            <IconButton id="deleteIcon" aria-label="edit workspace" color='primary' onClick={(e) => onDeleteClick(e, workspace)}>
              <DeleteIcon />
            </IconButton>
        </span>)}
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
