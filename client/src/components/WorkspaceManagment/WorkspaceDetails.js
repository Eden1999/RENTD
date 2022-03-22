import React from "react";
import { useLocation } from "react-router-dom";
import { Star, Wifi, SmokeFree, SmokingRooms, Accessible } from "@mui/icons-material";
import Orders from "./Orders";

import "./WorkspaceDetails.scss";

const WorkspaceDetails = () => {
  const {
    state: { workspace },
  } = useLocation();

  return (
    <div className="workspace-details-main">
      <div className="title">
        <h1>{workspace.name}</h1>
      </div>
      <div className="details">
        <div className="rating">
          {workspace.ratings.length > 0 && (
            <>
              <Star fontSize="14px" />
              <span>
                {workspace.ratings.reduce((total, currRating) => total + currRating.rating, 0) /
                  workspace.ratings.length}
              </span>
              <div className="details-separator"></div>
              <span>{workspace.ratings.length} reviews</span>
              <div className="details-separator"></div>
            </>
          )}
        </div>
        <div className="location">{workspace.location}</div>
      </div>
      <div className="photo">
        <img src={workspace.photo} />
      </div>
      {workspace.spaceType && 
        <div className="space-type">
          <h2>
            {workspace.spaceType.name} hosted by {workspace.host.username}
          </h2>
        </div>}
      <div className="capacity">
        <h3>Total of {workspace.capacity} spots</h3>
      </div>
      <div className="description-separator"></div>
      <div className="description">
        <span>{workspace.description}</span>
      </div>
      <div className="extra-details-separator"></div>
      <div className="extra-details">
        {workspace.wifi && (
          <div className="wifi">
            <Wifi /> Wifi
          </div>
        )}
        {workspace.disabled_access && (
          <div className="disabled-access">
            <Accessible /> Disabled accessible
          </div>
        )}
        <div className="smoking">
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
      {workspace.ratings.length > 0 && (
        <>
          <div className="reviews-separator"></div>
          <div className="reviews-title">
            <h2>{workspace.ratings.length} reviews</h2>
          </div>
          <div className="reviews">
            {workspace.ratings.map((rating) => (
              <div key={rating.id} className="review">
                <div className="user-photo">
                  <img src={rating.user.photo} />
                </div>
                <div className="review-content">
                  <div className="user">
                    <h2>{rating.user.username}</h2>
                  </div>
                  <div className="rating">
                    <Star fontSize="14px" />
                    <span>{rating.rating}</span>
                  </div>
                  <div className="description">
                    <span>{rating.comment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <a>rent</a>
      <Orders></Orders>
    </div>
  );
};

export default WorkspaceDetails;
