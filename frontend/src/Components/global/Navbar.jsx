import React, { useState, useEffect } from "react";
import { SignedIn, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../../Styles/global/navbar.css";
import { SearchBar } from "../SearchBar";
import { CustomButton } from "../CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { signOut, user } = useClerk();

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/sign-in");
    }
  };

  const handleShop = () => {
    if (user) {
      navigate("/shoppingCard");
    } else {
      navigate("/");
    }
  };

  const handleLogOut = async () => {
    await signOut();

    navigate("/");
  };

  useEffect(() => {
    const enableMobileMenu = () => {
      if (window.innerWidth <= 1024) {
      } else {
        setMenuOpened(false);
      }
    };

    window.addEventListener("resize", enableMobileMenu);

    return () => {
      window.removeEventListener("resize", enableMobileMenu);
    };
  }, []);

  return (
    <nav>
      <img src="/pictures/logo.jpg" alt="" className="logoIcon" />
      <SearchBar></SearchBar>
      <div className={`links ${menuOpened ? "show" : ""}`}>
        <a href="/">Accueil</a>
        <a href="/searchFarm">Les fermes</a>
        <a href="/support">Nos contacter</a>
        <div className="userIconsContainer">
          <CustomButton text="Mon compte" onClick={handleClick}></CustomButton>
          <div onClick={handleShop}>
            <FontAwesomeIcon
              icon={faCartShopping}
              size="xl"
              className="cartShoppingIcon"
            />
          </div>
          <SignedIn>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size="xl"
              className="cartShoppingIcon"
              onClick={handleLogOut}
            />
          </SignedIn>
        </div>
      </div>
      <div
        className={`menu ${menuOpened ? "opened" : ""}`}
        onClick={toggleMenu}
      >
        <div className="middle"></div>
      </div>
    </nav>
  );
};

export default Navbar;
