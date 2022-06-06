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
      <div className="flex w-2/3 flex-col">
            <div className={"ml-[17.5rem] my-8 text-primary text-4xl text-left font-medium"}>
              We found multiple options for you
            </div>
            <SearchResultsList
              setMapMarkers={setMapMarkers}
              hoveredMarkerId={hoveredMarkerId}
              setHoveredWorkspaceId={setHoveredWorkspaceId}
            />
      </div>
      <div className="flex w-1/3 min-h-full mr-24 my-8">
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
