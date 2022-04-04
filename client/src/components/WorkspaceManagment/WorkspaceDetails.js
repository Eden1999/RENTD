import React from "react";
import { useLocation } from "react-router-dom";
import { StarBorderRounded, Wifi, SmokeFree, SmokingRooms, Accessible } from "@mui/icons-material";
import Orders from "./Orders/Orders";

import "./WorkspaceDetails.scss";
import { Rating } from "@mui/material";

const WorkspaceDetails = () => {
  const {
    state: { workspace },
  } = useLocation();

  return (
    <div className="flex flex-column justify-center h-full px-20 py-10 2xl:py-20">
    <div>
        <div className="flex flex-row items-center">
          <p className="text-3xl text-white pr-3">{workspace.name}</p>
          {workspace.ratings.length > 0 && (
            <Rating className="pr-1" name="read-only" value={workspace.ratings.reduce((total, currRating) => total + currRating.rating, 0) /
                workspace.ratings.length} readOnly /> 
          )}
          <p className="text-sm text-white pr-3">({workspace.ratings.length} reviews)</p>  
        </div>
        {workspace.spaceType && <p className="text-md text-white">{workspace.spaceType.name}</p>}
        <p className="text-amber-800 pb-7">Hurry up! {workspace.capacity} spots left</p>
        <div className="details">
          <div className="flex flex-column">
          </div>
          <div className="location">{workspace.location}</div>
        </div>
        <div className="hero container mx-auto w-3/12 pb-10">
          <img src={workspace.photo} />
        </div>
        <span className="text-md text-white">
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
        <div>
          <Orders
            workspace={workspace}
          />
        </div>
    </div>
    </div>
  );
};

export default WorkspaceDetails;
