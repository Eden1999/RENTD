import React, { useState, useCallback, useEffect } from "react";
import Axios from "axios";
import { Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import Map from "../Map/Map";

import "./WorkspacesSearchResults.scss";

const WorkspacesSearchResults = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [filters, setFilters] = useState({});
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.post("http://localhost:8000/workspaces/search", query);
      console.log(res.data);
      setWorkspaces(res.data);
    } catch (err) {
      console.log(`Failed to fetch workspaces ${err.message}`);
    }
  }, []);

  useEffect(async () => {
    const newFilteredWorkspaces = workspaces.filter((workspace) => {
      let isFilteredIn = true;
      Object.entries(filters).forEach(
        ([filterType, value]) => (isFilteredIn &= workspace[filterType] === value)
      );

      return isFilteredIn;
    });

    setFilteredWorkspaces(newFilteredWorkspaces);
  }, [workspaces, filters]);

  const onItemHover = useCallback(
    (workspaceId) => {
      setHoveredWorkspaceId(workspaceId);
    },
    [setHoveredWorkspaceId]
  );

  const onItemStopHover = useCallback(() => {
    setHoveredWorkspaceId(null);
  }, [setHoveredWorkspaceId]);

  const onItemClick = useCallback(
    (workspace) => {
      navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
    },
    [setHoveredWorkspaceId]
  );

  const onMarkerHover = useCallback(
    (workspaceId) => {
      setHoveredMarker(workspaceId);
    },
    [setHoveredMarker]
  );

  const filterClicked = (e) => {
    const filterType = e.target.id;
    const newFilters = { ...filters };
    if (filters[filterType] != null) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = true;
    }

    setFilters(newFilters);
  };

  return (
    <div className="workspaces-search-main">
      <div className="content">
        <div className="workspaces-count">
          <h2>We've found {filteredWorkspaces.length} workspaces for you!</h2>
        </div>
        <div className="filters">
          <button
            id="wifi"
            className="outlined curved"
            role="checkbox"
            aria-checked={!!filters.wifi}
            onClick={filterClicked}
            type="button"
          >
            Wifi
          </button>
          <button
            id="disabled_access"
            className="outlined curved"
            role="checkbox"
            aria-checked={!!filters.disabled_access}
            onClick={filterClicked}
            type="button"
          >
            Disabled access
          </button>
          <button
            id="smoke_friendly"
            className="outlined curved"
            role="checkbox"
            aria-checked={!!filters.smoke_friendly}
            onClick={filterClicked}
            type="button"
          >
            Smoke free
          </button>
        </div>
        <div className="workspaces">
          {filteredWorkspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`item ${
                hoveredMarker === workspace.id || hoveredWorkspaceId === workspace.id ? "hover" : ""
              }`}
              onMouseEnter={() => onItemHover(workspace.id)}
              onMouseLeave={onItemStopHover}
              onClick={() => onItemClick(workspace)}
            >
              <div className="photo">
                <img src={workspace.photo} />
              </div>
              <div className="item-content">
                <div className="title">
                  <h2>{workspace.name}</h2>
                </div>
                <div className="separator"></div>
                <div className="details">
                  <div className="rating">
                    {workspace.ratings.length > 0 && (
                      <>
                        <Star fontSize="14px" />
                        <span>
                          {workspace.ratings.reduce(
                            (total, currRating) => total + currRating.rating,
                            0
                          ) / workspace.ratings.length}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="price">
                    {workspace.cost_per_hour}
                    <span> / hour</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="map">
        <Map
          onMarkerHover={onMarkerHover}
          hoveredMarkerId={hoveredWorkspaceId}
          markers={filteredWorkspaces.map(({ id, location_x, location_y, cost_per_hour }) => ({
            id,
            lat: location_x,
            lng: location_y,
            text: cost_per_hour,
          }))}
        />
      </div>
    </div>
  );
};

export default WorkspacesSearchResults;
