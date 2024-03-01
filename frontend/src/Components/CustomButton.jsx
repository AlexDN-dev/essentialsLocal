import React from "react";
import "../Styles/customButton.css";

export const CustomButton = ({ text, onClick, type }) => {
  return (
    <button type={type} className="customButton" onClick={onClick}>
      {text}
    </button>
  );
};
