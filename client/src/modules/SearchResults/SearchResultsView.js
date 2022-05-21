import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Map from "../Map/Map";
import SearchResultsList from "./SearchResultsList";

const SearchResultsView = () => {
  const [mapMarkers, setMapMarkers] = useState([]);
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const { state } = useLocation();
  let { city } = state;
  city = JSON.parse(city);

  const onMarkerHover = useCallback(
    (workspaceId) => {
      setHoveredMarkerId(workspaceId);
    },
    [setHoveredMarkerId]
  );

  return (
    <div className="h-full flex flex-row flex-1">
      <div className="flex w-1/2">
        <div className={"flex-1 flex flex-col"}>
          <div className={"h-20 mt-8"}>
            <div className={"ml-[17.5rem] text-white text-left text-3xl"}>
              We found multiple options for you
            </div>
          </div>
          <div className={"flex-1"}>
            <SearchResultsList
              setMapMarkers={setMapMarkers}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredWorkspaceId={setHoveredWorkspaceId}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 min-h-full mx-44 my-8">
        <div className="w-full">
          <Map
            onMarkerHover={onMarkerHover}
            hoveredMarkerId={hoveredWorkspaceId}
            center_location={city.location}
            markers={mapMarkers.map(({ id, location_x, location_y, assets }) => {
              let workspaceCosts = assets.map((x) => {
                return x.cost_per_hour;
              });
              let max = Math.max.apply(Math, workspaceCosts);
              let min = Math.min.apply(Math, workspaceCosts);
              return {
                id,
                lat: location_y,
                lng: location_x,
                text: `${min}-${max}`,
              };
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResultsView;
