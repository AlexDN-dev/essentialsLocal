import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faUser,
  faTractor,
  faCommentDots,
  faBagShopping,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../../Styles/global/AdminNavbar.css";
import { CustomButton } from "../CustomButton";
import { useState } from "react";

export const AdminNavbar = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();

  const toggleBurgerMenu = () => {
    setIsOpened(!isOpened);
  };
  const goToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="heroBanner">
        <div className="burgerContainer">
          <img src="/pictures/logo.jpg" alt="" />
          <FontAwesomeIcon
            icon={faBars}
            size="xl"
            className="burgerIcon"
            onClick={toggleBurgerMenu}
          />
        </div>
        <h3>Dashboard admin</h3>
      </div>
      <div className="adminContent">
        <div className={`adminNavbarContainer ${!isOpened ? "opened" : ""}`}>
          <div>
            <a href="/admin" className="adminButton">
              <FontAwesomeIcon icon={faHouse} size="xl" color="black" />
              <p>Accueil</p>
            </a>
            <a href="/admin/users" className="adminButton">
              <FontAwesomeIcon icon={faUser} size="xl" color="black" />
              <p>Les utilisateurs</p>
            </a>
            <a href="/admin/farms" className="adminButton">
              <FontAwesomeIcon icon={faTractor} size="xl" color="black" />
              <p>Les fermes</p>
            </a>
            <a href="/admin/support" className="adminButton">
              <FontAwesomeIcon icon={faCommentDots} size="xl" color="black" />
              <p>Demande d'ajout</p>
            </a>
            <a href="/admin/deliverer" className="adminButton">
              <FontAwesomeIcon icon={faBagShopping} size="xl" color="black" />
              <p>Les livreurs</p>
            </a>
          </div>
          <CustomButton
            text={"Retour au site"}
            onClick={goToHome}
          ></CustomButton>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
