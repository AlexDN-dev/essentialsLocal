import { Footer } from "../Components/global/Footer";
import Navbar from "../Components/global/Navbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasFarm } from "../API/farmsAPI";
import "../Styles/views/farmParams.css";
import { GlobalParams } from "../Components/farmParams/GlobalParams";
import { ProductFarmManagement } from "../Components/farmParams/ProductFarmManagement";
import { FarmOrders } from "../Components/farmParams/FarmOrders";

const categories = ["Paramètres généraux", "Produits", "Commandes"];

export const FarmParams = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [farm, setFarm] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(
    "Paramètres généraux"
  );
  const navigate = useNavigate();

  const getFarmData = async () => {
    try {
      const farmData = await hasFarm(user.emailAddresses[0].emailAddress);
      setFarm(farmData.data[0]);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de la ferme:",
        error
      );
    }
  };

  let selectedComponent;
  switch (selectedCategory) {
    case "Paramètres généraux":
      selectedComponent = <GlobalParams data={farm} />;
      break;
    case "Produits":
      selectedComponent = <ProductFarmManagement data={farm} />;
      break;
    case "Commandes":
      selectedComponent = <FarmOrders farmId={farm.id} />;
      break;
    default:
      selectedComponent = null;
      break;
  }

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/");
    } else {
      if (isLoaded) {
        getFarmData();
      }
    }
  }, [isSignedIn, isLoaded, navigate]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Navbar />
      <div className="paramsContainer">
        <div className="params">
          <h2>Paramètres de la ferme</h2>
          <div className="paramsCategory">
            {categories.map((category) => (
              <p
                key={category}
                className={
                  selectedCategory === category ? "selectedCategory" : ""
                }
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </p>
            ))}
          </div>
        </div>
        {selectedComponent}
      </div>
      <Footer />
    </>
  );
};
