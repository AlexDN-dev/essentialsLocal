import React from "react";
import Navbar from "./global/Navbar";
import "../Styles/landingPage.css";

export const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="landingPage">
        <section className="leftPart">
          <h2>
            <span>EssentialsLocal</span>
            <br></br>Cultiver les Liens Locaux, Savourer la Qualité
          </h2>
          <div className="bars">
            <div className="bar1"></div>
            <div className="bar2"></div>
          </div>
        </section>
        <section className="rightPart">
          <img
            className="frontImg"
            src="/pictures/landingPage-2.jpg"
            alt="Description de l'image"
          />
          <img
            className="behindImg"
            src="/pictures/landingPage-1.jpg"
            alt="Description de l'image"
          />
        </section>
      </div>
    </>
  );
};
