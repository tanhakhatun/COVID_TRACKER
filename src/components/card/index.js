import React from "react";
import "./index.css";

export default function Card({ changeMapColor, heading, cases, color, type }) {
  const setMapColor = () => {
    changeMapColor(color, type);
  };

  return (
    <div onClick={setMapColor} className="cardContainer">
      <h3>{heading}</h3>
      <div className="cardBody" style={{ background: color }}>
        {cases}
      </div>
    </div>
  );
}
