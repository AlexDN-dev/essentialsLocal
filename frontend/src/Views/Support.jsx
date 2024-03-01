import Navbar from "../Components/global/Navbar";
import { Footer } from "../Components/global/Footer";
import React, { useState } from "react";
import "../Styles/views/support.css";
import { CustomSelect } from "../Components/CustomSelect";
import { SupportForm } from "../Components/SupportForm";
import { FarmForm } from "../Components/FarmForm";
import { ToastContainer } from "react-toastify";

export const Support = () => {
  const options = [
    "J'ai un(e) question / problème",
    "Je souhaite ajouter ma ferme",
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Navbar />
      <div className="support">
        <div className="introSupport">
          <ToastContainer />
          <h2>SUPPORT</h2>
          <p>
            Vous avez une ferme et vous souhaitez rejoindre EssentialsLocal ?{" "}
            <br></br>Ou simplement poser une question ? Alors le support est à
            pour accéder a votre demande.
          </p>
        </div>
        <FarmForm />
      </div>
      <Footer />
    </div>
  );
};
