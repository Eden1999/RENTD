import React from "react";
import GoogleMapReact from "google-map-react";

import Marker from "./Marker";

const Map = ({ hoveredMarkerId, onMarkerHover, markers }) => {
  const onChildMouseEnter = (key) => {
    onMarkerHover(key);
  };

  const onChildMouseLeave = () => {
    onMarkerHover(null);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAuGj5jlZEbHnClaEGrepx4vCtj7Yb2B6w" }}
        onChildMouseEnter={onChildMouseEnter}
        onChildMouseLeave={onChildMouseLeave}
        defaultCenter={{ lat: 1, lng: 1 }}
        defaultZoom={5}
      >
        {markers.map(({ id, lat, lng, text }) => (
          <Marker key={id} lat={lat} lng={lng} text={text} hoveredAtList={hoveredMarkerId === id} />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
