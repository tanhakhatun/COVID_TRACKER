import React from "react";
import "./index.css";

export default function Flag({ countryInfo }) {
  return (
    <>
      <img src={countryInfo?.flag} className="countryFlag" alt="countryFlag" />
    </>
  );
}
