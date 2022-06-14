import React from "react";

import './Marker.css'

const Marker = (props) => {
  return (
       <div className={`badge badge-lg rounded-xl bg-base-100 text-black font-medium drop-shadow-md hover:bg-base-300 hover:cursor-pointer ${props.hoveredAtList ? "bg-base-300" : ""}`}>
      {props.text}
    </div>
  );
};

export default Marker;
