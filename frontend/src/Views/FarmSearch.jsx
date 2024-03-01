import Navbar from "../Components/global/Navbar";
import { Footer } from "../Components/global/Footer";
import "../Styles/views/farmSearch.css";
import { LeafletMap } from "../Components/LeafletMap";
import { FarmCard } from "../Components/FarmCard";
import { CustomInput } from "../Components/CustomInput";
import { CustomButton } from "../Components/CustomButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFarmsByLocation } from "../API/farmsAPI";

export const FarmSearch = () => {
  const [searching, setSearching] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [farmList, setFarmList] = useState([]);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);

  const navigate = useNavigate();

  const navigateClick = (id) => {
    navigate(`/farm/${id}`);
  };

  const handleSearchClick = async () => {
    if (location !== "") {
      setSearching(true);
      setFirstSearch(false);
      setTimeout(() => {
        setSearching(false);
      }, 1500);
      try {
        const farms = await getFarmsByLocation(location);
        setCoords(farms.coords);
        setFarmList(farms.farms);
      } catch (error) {
        console.error("Erreur lors de la récupération des fermes :", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="farmSearchInfo">
        <h2>RECHERCHER UNE FERME</h2>
        <p>
          Envie de découvrir les produits locaux qui vous entoure ? Alors vous
          vous trouvez au bon endroit !
        </p>
        <div style={{ width: "300px", marginTop: "10px" }}>
          <CustomInput
            placeholder={"Entrer une ville"}
            onChange={(e) => setLocation(e.target.value)}
          />
          <CustomButton
            text={"Rechercher"}
            onClick={handleSearchClick}
          ></CustomButton>
        </div>
      </div>
      {firstSearch ? null : (
        <div className="farmSearch">
          {searching ? (
            <div className="loading">
              <img src="/gif/loader.gif" alt="loader" />
              <p>Chargement en cours...</p>
            </div>
          ) : (
            <>
              <div>
                <h2>Liste des fermes</h2>
                <div className="farmListContainer">
                  {farmList.map((farm) => (
                    <FarmCard
                      key={farm.id}
                      data={farm}
                      onClick={() => navigateClick(farm.id)}
                    ></FarmCard>
                  ))}
                </div>
              </div>
              <div className="mapContainer">
                <LeafletMap farmList={farmList} center={coords} />
              </div>
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};
