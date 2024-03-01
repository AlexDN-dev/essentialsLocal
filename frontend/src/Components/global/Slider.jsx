import React, { useState } from "react";
import "../../Styles/global/slider.css"; // Assurez-vous d'importer le fichier CSS

export const Slider = ({ imageUrls }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="image-slider">
      <img
        src={imageUrls[currentImageIndex]}
        alt={`Image ${currentImageIndex + 1}`}
      />
      <div>
        <button onClick={goToPreviousImage}>&lt;</button>
        <button onClick={goToNextImage}>&gt;</button>
      </div>
    </div>
  );
};
