import React from "react";

import "./Marker.css";

const Marker = (props) => {
  return (
    <div
      className={`map-marker ${
        props.$hover || props.hoveredAtList ? "hover" : ""
      }`}
    >
      <p>{props.text}</p>
    </div>
  );
};

export default Marker;
