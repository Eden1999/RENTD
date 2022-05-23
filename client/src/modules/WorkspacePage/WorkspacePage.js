import React, { useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import useToken from "../../helpers/useToken";

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { StarBorderRounded, Wifi, SmokeFree, SmokingRooms, Accessible } from "@mui/icons-material";
import Orders from "../Orders/Orders";

import "./WorkspacePage.scss";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, TextField } from "@mui/material";
import { AppContext } from "store/AppContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toast } from "react-toastify";

const WorkspacePage = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [{ user }, dispatch] = useContext(AppContext);
  const [workspace, setWorkspace] = useState(useLocation().state.workspace)
  const {
    state: { isEditable },
  } = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useToken();

  
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
  
  const onFavoriteClick = useCallback((workspace) => {
    axios.post('http://localhost:8000/users/addWorkspaceToFavorites', {workspaceId : workspace.id}, {
      headers: {
        token,
      }
    })
    .then((res) => {
      toast(res.data)
      let updatedUser = {...user, favorite_workspaces : (user.favorite_workspaces ? 
        [...user.favorite_workspaces, workspace.id] : 
        [workspace.id])};
      
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({
        type: "SET_GENERAL_STATE",
        payload: {
            user: updatedUser
        },
      })
    })
    .catch(err =>{
        alert(err.response.data)
    })
  }, []);

  const onRemoveFavoriteClick = useCallback((workspace) => {
    axios.post('http://localhost:8000/users/removeFavoriteWorkspace', {workspaceId : workspace.id}, {
      headers: {
        token,
      }
    })
    .then((res) => {
      toast(res.data)
      let updatedUser = {...user, favorite_workspaces : user.favorite_workspaces.filter((id) => id != workspace.id)}
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({
        type: "SET_GENERAL_STATE",
        payload: {
            user: updatedUser
        },
      })
    })
    .catch(err =>{
        alert(err.response.data)
    })
  }, []);

  return (
    <div className="flex flex-column justify-center h-full px-20 py-10 2xl:py-20">
    <div>
        <div className="flex flex-row items-center">
        {isEditable && (<span>
            <IconButton id="editIcon" aria-label="edit workspace" onClick={(e) => onEditClick(e, workspace)}>
              <EditIcon htmlColor="#4AA0D5"/>
            </IconButton>
            <IconButton id="deleteIcon" aria-label="edit workspace" onClick={(e) => onDeleteClick(e, workspace)}>
              <DeleteIcon htmlColor="#EB586F"/>
            </IconButton>
        </span>)}
          <p className="text-3xl text-white pr-3">{workspace.name}</p>
          {workspace.ratings.length > 0 && (
            <Rating precision={0.5} className="pr-1" name="read-only" value={workspace.ratings.reduce((total, currRating) => total + parseInt(currRating.rating), 0) /
                workspace.ratings.length} readOnly /> 
          )}
          <p className="text-md text-white pr-3">({workspace.ratings.length} reviews)</p>  
          {user?.favorite_workspaces?.includes(workspace.id) ? 
          <IconButton id="editIcon" aria-label="remove from favorites" color='secondary' onClick={() => onRemoveFavoriteClick(workspace)}>
            <FavoriteIcon />
          </IconButton> :
            <IconButton id="editIcon" aria-label="add to favorites" color='secondary' onClick={() => onFavoriteClick(workspace)}>
              <FavoriteBorderIcon />
            </IconButton> 
          }
        </div>
        {workspace.spaceType && <p className="text-lg text-white">{workspace.spaceType.name}</p>}
        {/* <p className="text-amber-800 pb-7">Hurry up! {workspace.capacity} spots left</p> */}
        <div className="details">
          <div className="flex flex-column">
          </div>
          <div className="location">{workspace.location}</div>
        </div>
        <div className="hero container mx-auto w-96 pb-10">
          <img src={workspace.photo} />
        </div>
        <span className="text-lg text-white">
          <p className="pb-10">{workspace.description}</p>
          <div className="extra-details pb-10">
            {workspace.wifi && (
              <div className="text-md text-white wifi">
                <Wifi /> Wifi
              </div>
            )}
            {workspace.disabled_access && (
              <div className="text-md text-white disabled-access">
                <Accessible /> Disabled accessible
              </div>
            )}
            <div className="text-md text-white smoking">
              {workspace.smoke_friendly ? (
                <span>
                  <SmokeFree /> Smoking forbidden
                </span>
              ) : (
                <span>
                  <SmokingRooms /> Smoking allowed
                </span>
              )}
            </div>
          </div>
        </span>
          <>
            {workspace.ratings.length > 0 && (
            <>
              <div className="reviews-title">
                <h2 className="text-xl text-white pb-3">Reviews</h2>
              </div>
              <div className="reviews">
                {workspace.ratings.map((rating) => (
                  <div key={rating.id} className="flex justify-between pb-3">
                    <div className="user-photo">
                      <Rating name="read-only" value={rating.rating} readOnly 
                      emptyIcon={<StarBorderRounded style={{ opacity: 0.55, color : "white" }} fontSize="inherit"/>}/>
                    </div>
                    <span className="flex flex-col text-md text-white">
                        <h2 className="text-right">{rating.user.username}</h2>
                        <span>{rating.comment}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
            )}
          
          </>
        <Orders workspace={workspace}/>
    </div>
    </div>
  );
};

export default WorkspacePage;
