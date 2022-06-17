import React, {useCallback, useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {workspaceListType} from "../helpers/consts";
import Review from "../modules/History/Review";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import {AppContext} from "../store/AppContext";
import axios from "axios";
import {toast} from "react-toastify";
import useToken from "../helpers/useToken";
import Axios from "axios";
import {Wifi, SmokeFree, SmokingRooms, Accessible } from "@mui/icons-material";

const WorkspacesListItem = ({
  workspace,
  order,
  workspaceCardBody,
  hoveredOnMap,
  setHoveredWorkspaceId,
}) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [{ user }, dispatch] = useContext(AppContext);
    const { token } = useToken();
    const currentWorkspace = workspace ? workspace: order.workspace;
    const [cheapestAsset, setCheapestAsset] = useState({cost_per_hour:0});
    const [currentAsset, setCurrentAsset] = useState();


    // Get cheapest asset price
    useEffect(async () => {
        try {
            const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}assets/workspaceId/${currentWorkspace.id}`);

            const orderedAssets = res.data.sort((a,b) => {
                return a.cost_per_hour - b.cost_per_hour;
            });
            setCheapestAsset(orderedAssets[0]);
        } catch (err) {
            console.log(`Failed to fetch assets by workspace id ${err.message}`);
        }
    }, [order]);

    // Get order's asset
    useEffect(async () => {
        try {
            if(order) {
                const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}assets/${order.asset_id}`);
                setCurrentAsset(res.data);
            }
        } catch (err) {
            console.log(`Failed to fetch asset from order ${err.message}`);
        }
    }, []);


    const onItemClick = useCallback((e, workspace) => {
    navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
  }, []);

  const onItemHover = useCallback(
    (workspaceId) => {
      setHoveredWorkspaceId &&
      setHoveredWorkspaceId(workspaceId);
    },
    [setHoveredWorkspaceId]
  );

  const onItemStopHover = useCallback(() => {
    setHoveredWorkspaceId &&
    setHoveredWorkspaceId(null);
  }, [setHoveredWorkspaceId]);

    const onFavoriteClick = useCallback((workspace) => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}users/addWorkspaceToFavorites`, {workspaceId : workspace.id}, {
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
            .catch(err =>{
                alert(err.response.data)
            })
    }, []);

    const onRemoveFavoriteClick = useCallback((workspace) => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}users/removeFavoriteWorkspace`, {workspaceId : workspace.id}, {
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
            .catch(err =>{
                alert(err.response.data)
            })
    }, []);

    const getTotalPrice = () => {
        const numOfRentingHours = Math.abs(new Date(order.startdate) - new Date(order.enddate))/(1000*3600);
        return(currentAsset?.cost_per_hour * numOfRentingHours);
    }

  return (
      <div className="flex">
        <div className={`card card-compact w-80 rounded-3xl ${hoveredOnMap ? "hover" : ""} hover:drop-shadow-2xl hover:cursor-pointer mb-6`}
             onMouseEnter={() => onItemHover(currentWorkspace.id)}
             onMouseLeave={onItemStopHover}
             id="listItem"
             onClick={(e) => onItemClick(e, currentWorkspace)}
        >
          <img className="rounded-3xl w-80 h-80 object-cover" src={currentWorkspace.photos?.[0]} alt={currentWorkspace.name}/>
            <div className="flex absolute self-end p-4">
                {!user?.is_host && user?.favorite_workspaces?.includes(currentWorkspace.id) ?
                    <button className="btn btn-ghost btn-sm bg-black/50 btn-circle text-error" onClick={(event) => {
                        event.stopPropagation();
                        onRemoveFavoriteClick(currentWorkspace);
                    }}>
                        <FavoriteIcon />
                    </button> :
                    !user?.is_host &&
                    <button className="btn btn-ghost btn-sm bg-black/50 btn-circle text-white" onClick={(event) => {
                        event.stopPropagation();
                        onFavoriteClick(currentWorkspace);
                    }}>
                        <FavoriteTwoToneIcon />
                    </button>
                }
            </div>
            <div className="card-body">
            <h1 className="card-title text-primary">{currentWorkspace.name}, {currentWorkspace.city}</h1>
            {
              workspaceCardBody === workspaceListType.general &&
              <div>
                  <span className="text-secondary">{currentWorkspace.description}</span>
                  <div>
                      <span className="text-primary font-medium flex-grow-0">{cheapestAsset.cost_per_hour}₪ per hour</span>
                  </div>
                  <div className="text-right">
                    {workspace.wifi && (
                    <div className="text-md text-secondary wifi">
                        <Wifi /> Wifi
                    </div>
                    )}
                    {workspace.disabled_access && (
                    <div className="text-md text-secondary disabled-access">
                        <Accessible /> Disabled accessible
                    </div>
                    )}
                    <div className="text-md text-secondary smoking">
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
              </div>
            }
            {
              workspaceCardBody === workspaceListType.history &&
              <div>
                <span className="text-secondary">{currentAsset?.text}, {order.capacity} people</span>
                  <p className="text-secondary">{new Date(order.startdate).toLocaleString()} - {new Date(order.enddate).toLocaleString()}</p>
                <div>
                  <span className="text-primary font-medium flex-grow-0">{currentAsset?.cost_per_hour}₪ per hour · </span>
                  <span className="text-secondary font-medium underline">{getTotalPrice()}₪ total</span>
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={(event) => {
                      event.stopPropagation();
                      setIsReviewDialogOpen(true);
                  }}>Review</button>
                </div>
              </div>
            }
          </div>
        </div>
        <Review open={isReviewDialogOpen} setOpen={setIsReviewDialogOpen} workspace_id={currentWorkspace.id}/>
      </div>
  );
};

export default WorkspacesListItem;
