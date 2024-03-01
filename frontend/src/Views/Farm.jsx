import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/global/Navbar";
import { Footer } from "../Components/global/Footer";
import { ProductCard } from "../Components/ProductCard";
import { getFarmDetailsAndProducts } from "../API/farmsAPI";
import "../Styles/views/farm.css";

export const Farm = () => {
  const { farmId } = useParams();
  const [viewProducts, setViewProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [farmDetails, setFarmDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getFarmDetailsAndProducts(farmId);
        setFarmDetails(data.farmDetails[0]);
        setViewProducts(data.farmProduct.slice(0, 6));
      } catch (error) {
        console.error("Erreur lors de la récupération des données: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  const schedule = farmDetails.schedule ? farmDetails.schedule.split(",") : [];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const isBottom = windowHeight + scrollY >= documentHeight;

      if (isBottom && !isLoading && viewProducts.length < farmDetails.length) {
        setIsLoading(true);

        setTimeout(() => {
          setViewProducts((prevViewProducts) => {
            const remainingProducts = farmDetails.slice(
              prevViewProducts.length
            );
            const nextProducts = remainingProducts.slice(0, 6);
            setIsLoading(false);
            return [...prevViewProducts, ...nextProducts];
          });
        }, 1500);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [farmDetails, viewProducts, isLoading]);
  return (
    <div>
      <Navbar />
      <div className="farmContainer">
        <div className="farm">
          <div className="farmInformationContainer">
            <div>
              <img
                src={`http://localhost:3000/farms/${farmId}.png`}
                alt="Image de la ferme"
              />

              <div className="farmInformation">
                <h2>{farmDetails.name}</h2>
                <p>{farmDetails.address}</p>
                <h3>Horaire d'ouverture</h3>
                <p>Lundi : {schedule[0]}</p>
                <p>Mardi : {schedule[1]}</p>
                <p>Mercredi : {schedule[2]}</p>
                <p>Jeudi : {schedule[3]}</p>
                <p>Vendredi : {schedule[4]}</p>
                <p>Samedi : {schedule[5]}</p>
                <p>Dimanche : {schedule[6]}</p>
              </div>
            </div>
            <div className="farmDescription">
              <span>Petit mot de la ferme...</span>
              <p>{farmDetails.desc}</p>
            </div>
          </div>
          <div className="farmProductContainer">
            <h2>Les produits de la ferme</h2>
            <div className="productList">
              {viewProducts.map((product) => (
                <ProductCard
                  key={product.name}
                  name={product.name}
                  id={product.id}
                  backgroundImage={
                    import.meta.env.VITE_SERVER_ADDRESS + product.picture
                  }
                />
              ))}
            </div>
            {isLoading && (
              <div className="loading">
                <img src="/gif/loader.gif" alt="loader" />
                <p>Chargement des produits...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
