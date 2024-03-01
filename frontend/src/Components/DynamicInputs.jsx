import React, { useState } from "react";
import { CustomButton } from "./CustomButton";

export const DynamicInputs = ({ onChange }) => {
  const [inputCount, setInputCount] = useState(0);
  const [inputValues, setInputValues] = useState([]);

  const handleAddInput = () => {
    if (inputCount < 5) {
      setInputCount(inputCount + 1);
      setInputValues([...inputValues, ""]);
    }
  };

  const handleRemoveInput = (index) => {
    if (inputCount > 0) {
      setInputCount(inputCount - 1);
      const updatedValues = [...inputValues];
      updatedValues.splice(index, 1);
      setInputValues(updatedValues);
    }
  };

  const handleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div>
      <div>
        <CustomButton
          type="button"
          text={"Ajouter un prix / quantité"}
          onClick={handleAddInput}
        ></CustomButton>
      </div>
      <p className="textTips">
        Si le produit à un prix pour un poids différents merci d'indiquer le
        prix ici avec cette syntaxe (exemple: 500g - 5).
      </p>
      {Array.from({ length: inputCount }).map((_, index) => (
        <div key={index}>
          <input
            type="text"
            value={inputValues[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="quantityInput"
          />
          <CustomButton
            type="button"
            text={"X"}
            onClick={() => handleRemoveInput(index)}
          ></CustomButton>
        </div>
      ))}
    </div>
  );
};

export default DynamicInputs;
