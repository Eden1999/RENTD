import React from "react";
import GoogleMapReact from "google-map-react";

import Marker from "./Marker";

const Map = ({ hoveredMarkerId, onMarkerHover, markers, center_location }) => {
  const onChildMouseEnter = (key) => {
    onMarkerHover(key);
  };

  const onChildMouseLeave = () => {
    onMarkerHover(null);
  };

  return (
    <div className="h-full w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAuGj5jlZEbHnClaEGrepx4vCtj7Yb2B6w" }}
        onChildMouseEnter={onChildMouseEnter}
        onChildMouseLeave={onChildMouseLeave}
        defaultCenter={center_location}
        defaultZoom={13}
      >
        {markers.map(({ id, lat, lng, text }) => (
          <Marker key={id} lat={lat} lng={lng} text={text} hoveredAtList={hoveredMarkerId === id} />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
