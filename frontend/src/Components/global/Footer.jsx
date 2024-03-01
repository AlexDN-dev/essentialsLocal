import React from "react";
import "../../Styles/global/footer.css";

export const Footer = () => {
  return (
    <div className="footer">
      <img src="/pictures/logo.jpg" alt="logo" />
      <p>
        &copy; 2023 EssentialsLocal. Tous droits réservés.
        <a href="/politique-de-confidentialite">CGU</a> |{" "}
        <a href="/conditions-generales">CGV</a>
      </p>
    </div>
  );
};
