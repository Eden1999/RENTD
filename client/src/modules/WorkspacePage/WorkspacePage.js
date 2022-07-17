import React, { useContext, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import useToken from "../../helpers/useToken";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppsIcon from '@mui/icons-material/Apps';

import {
  StarBorderRounded,
  Wifi,
  SmokeFree,
  SmokingRooms,
  Accessible,
  Star,
} from "@mui/icons-material";
import Orders from "../Orders/Orders";

import "./WorkspacePage.scss";
import { Dialog, Rating } from "@mui/material";
import { AppContext } from "store/AppContext";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toast } from "react-toastify";

const WorkspacePage = () => {
  const [{ user }, dispatch] = useContext(AppContext);
  const { token } = useToken();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(useLocation().state.workspace);

  const [host, setHost] = useState({ username: '' });
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Get workspace's host and missing details
  useEffect(async () => {
    try {
      if (!workspace.photos) {
        const numPhotos = workspace.photo_count
        workspace.photos = Array(numPhotos);

        Array(numPhotos).fill(1).map(async (x, y) => {
          let index = x + y;
          const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}workspaces/${workspace.id}/photos/${index}`, {
            headers: {
              token,
            }
          });
          let newData = await res.data;
          let newPhotos = workspace.photos;
          newPhotos[index - 1] = newData;
          setWorkspace({
            ...workspace, photos: newPhotos
          });
        })
      }

      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}users/${workspace.host_id}`, {
        headers: {
          token,
        }
      });

      setHost(res.data);
    } catch (err) {
      console.log(`Failed to fetch host or photos ${err.message}`);
    }
  }, []);

  const onEditClick = useCallback((e, workspace) => {
    navigate(`/manage/editWorkspace`, { state: { workspace } });
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }, []);

  const onDeleteClick = useCallback((e, workspace) => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}workspaces/${workspace.id}`,
      {
        headers: {
          token,
        }
      })
      .then((res) => {
        navigate('/my-spaces');
      })
      .catch(err => {
        alert(err.response.data)
      })

    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }, []);

  const onFavoriteClick = useCallback((workspace) => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}users/addWorkspaceToFavorites`, { workspaceId: workspace.id }, {
      headers: {
        token,
      }
    })
      .then((res) => {
        toast(res.data.message)
        sessionStorage.setItem('user', JSON.stringify(res.data.user));

        dispatch({
          type: "SET_GENERAL_STATE",
          payload: {
            user: res.data.user
          },
        })
      })
      .catch(err => {
        alert(err.response.data)
      })
  }, []);

  const onRemoveFavoriteClick = useCallback((workspace) => {
    axios.post(`${process.env.REACT_APP_SERVER_URL}users/removeFavoriteWorkspace`, { workspaceId: workspace.id }, {
      headers: {
        token,
      }
    })
      .then((res) => {
        toast(res.data.message)
        sessionStorage.setItem('user', JSON.stringify(res.data.user));

        dispatch({
          type: "SET_GENERAL_STATE",
          payload: {
            user: res.data.user
          },
        })
      })
      .catch(err => {
        alert(err.response.data)
      })
  }, []);

  return (
    <div className="justify-center h-full px-36 py-5">
      <div className="flex flex-row items-center justify-between">
        <p className="text-6xl text-primary pr-3">{workspace.name}</p>
        {workspace.host_id === user.id.toString() ?
          <span>
            <button
              id="editIcon"
              className="btn btn-ghost btn-circle text-primary"
              onClick={(e) => onEditClick(e, workspace)}>
              <EditIcon fontSize="large" />
            </button>
            <button
              id="deleteIcon"
              className="btn btn-ghost btn-circle text-error"
              onClick={(e) => onDeleteClick(e, workspace)}>
              <DeleteIcon fontSize="large" />
            </button>
          </span> :
          <span>
            {user?.favorite_workspaces?.includes(workspace.id) ?
              <button
                id="removeFavorite"
                className="btn btn-ghost btn-circle text-error"
                onClick={() => onRemoveFavoriteClick(workspace)}>
                <FavoriteIcon fontSize="large" />
              </button> :
              <button
                id="addFavorite"
                className="btn btn-ghost btn-circle text-primary"
                onClick={() => onFavoriteClick(workspace)}>
                <FavoriteBorderIcon fontSize="large" />
              </button>
            }
          </span>
        }
      </div>
      <div className="flex mt-2">
        {workspace.ratings.length > 0 ?
          <div className="flex">
            <p className="flex text-lg text-secondary font-medium">
              <Star fontSize="small" className="self-center" />
              {(workspace.ratings.map((review) => review.rating).reduce((total, currRate) => total + currRate, 0) / workspace.ratings.length).toFixed(2)}
            </p>
            <p className="text-xl text-secondary font-medium px-2">·</p>
            <p className="text-lg text-secondary font-medium">{workspace.ratings.length} reviews</p>
            <p className="text-xl text-secondary font-medium px-2">·</p>
          </div>:
          <div />
        }
        {workspace.spaceType && <p className="text-lg text-secondary font-medium">{workspace.city}, {workspace.address} </p>}
      </div>
      <div className="p-2 bg-base-200 rounded-lg mt-4">
        <div className="flex grid grid-cols-4 gap-2 h-[40rem] justify-items-stretch">
          <img className="h-[40rem] col-span-2 row-span-2 object-cover rounded-l-lg" src={workspace.photos?.[0]} />
          <img className="object-cover h-[19.75rem]" src={workspace.photos?.[1]} />
          <img className="object-cover h-[19.75rem] rounded-tr-lg" src={workspace.photos?.[2]} />
          <img className="object-cover h-[19.75rem]" src={workspace.photos?.[3]} />
          <img className="object-cover h-[19.75rem] rounded-br-lg" src={workspace.photos?.[4]} />
          <button className="btn btn-secondary bg-base-100 rounded-lg flex absolute self-end justify-self-end m-4">
            <AppsIcon />
            <p className="ml-1" onClick={() => setShowAllPhotos(true)}>Show all photos</p>
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-8">
        <div className="w-5/12">
          <div className="flex justify-between items-center">
            <p className="text-3xl text-primary font-medium">{workspace.spaceType.name} hosted by {host.username}</p>
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <img src={host.photo} />
              </div>
            </div>
          </div>
          <div className="divider" />
          <span className="text-2xl text-secondary pb-10">
            <p>{workspace.description}</p>
            <div className="pt-10 text-xl">
              {workspace.wifi && (
                <p> <Wifi /> Wifi </p>
              )}
              {workspace.disabled_access && (
                <p> <Accessible /> Disabled accessible </p>
              )}
              {!workspace.smoke_friendly ? (
                <p>
                  <SmokeFree /> Smoking forbidden
                </p>
              ) : (
                <p>
                  <SmokingRooms /> Smoking allowed
                </p>
              )}
            </div>
          </span>
        </div>
        <div className="w-1/2 bg-base-700 shadow-2xl rounded-xl p-4">
          <div className="flex items-center h-12">
            <p className="text-3xl text-primary font-bold">Order Now!</p>
          </div>
          <div className="divider" />
          <div className="p-4">
            <Orders workspace={workspace} />
          </div>
        </div>
      </div>
      <div className="divider" />
      {workspace.ratings.length > 0 && (
        <div>
          <div className="flex text-2xl text-primary font-medium">
            <p className="flex">
              <Star fontSize="small" className="self-center" />
              {(workspace.ratings.map((review) => review.rating).reduce((total, currRate) => total + currRate, 0) / workspace.ratings.length).toFixed(2)}
            </p>
            <p className="px-2">·</p>
            <p>{workspace.ratings.length} reviews</p>
          </div>
          <div className="grid grid-cols-2">
            {workspace.ratings.map((rating) => (
              <div key={rating.id} className="bg-base-100 shadow-lg m-8 p-4 rounded-lg">
                <div className="flex mb-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                      <img src={rating.user.photo} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-xl text-primary font-medium">{rating.user.username}</p>
                    <Rating
                      name="read-only"
                      value={rating.rating}
                      emptyIcon={<StarBorderRounded style={{ opacity: 0.55, color: "primary" }} fontSize="inherit" />}
                      readOnly
                    />
                  </div>
                </div>
                <span className="text-md text-secondary">{rating.comment}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Dialog
        open={showAllPhotos}
        onClose={() => { setShowAllPhotos(false) }}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "72rem",  // Set your width here
            },
          },
        }}
      >
        <div className="h-[60rem] grid grid-cols-2">
          {workspace.photos?.map((photo) => (
            <div className="m-2">
              <img
                className="h-[35rem] w-[35rem] object-cover rounded-lg"
                src={photo}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};


export default WorkspacePage;
