import React from "react";

import "./Marker.css";

const Marker = (props) => {
  return (
    <div className={`map-marker ${props.$hover || props.hoveredAtList ? "hover" : ""}`}>
      {props.text}
    </div>
  );
};

export default Marker;
