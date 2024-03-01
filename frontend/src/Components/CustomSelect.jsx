import React from "react";
import "../Styles/customSelect.css";

export const CustomSelect = ({ option, selectedOption, onSelectChange }) => {
  return (
    <select
      name="customSelect"
      id=""
      value={selectedOption}
      onChange={onSelectChange}
    >
      {option.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};
