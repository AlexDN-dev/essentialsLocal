import React, { useState } from "react";
import "../Styles/searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const searchProduct = () => {
    if (searchValue === "") {
      navigate("/");
    } else {
      navigate(`/search/${searchValue}`);
    }
  };

  return (
    <form className="searchBar">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button onClick={searchProduct}>
        <FontAwesomeIcon
          icon={faSearch}
          className="search-icon"
          size="lg"
          color="#ffffff"
        />
      </button>
    </form>
  );
};
