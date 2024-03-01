import React, { useState, useEffect } from "react";
import Navbar from "../Components/global/Navbar";
import { ProductCard } from "../Components/ProductCard";
import { Footer } from "../Components/global/Footer";
import { useParams } from "react-router-dom";
import { getProductFromSearch } from "../API/productsAPI";
import "../Styles/views/search.css";

export const Search = () => {
  const { item } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const data = await getProductFromSearch(item);
        setProducts(data.productResults);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [item]);

  return (
    <div>
      <Navbar />
      <div className="searchContainer">
        {isLoading && (
          <div className="loading">
            <img src="/gif/loader.gif" alt="loader" />
            <p>Chargement des produits...</p>
          </div>
        )}
        {!isLoading && products.length > 0 ? (
          <>
            <h2>{`${products.length} résultat(s) pour "${item}"`}</h2>
            <div className="search">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  id={p.id}
                  backgroundImage={
                    import.meta.env.VITE_SERVER_ADDRESS +
                    "/products/" +
                    p.picture +
                    ".png"
                  }
                ></ProductCard>
              ))}
            </div>
          </>
        ) : null}
        {!isLoading && products.length === 0 && (
          <div className="no-results">
            <h2>Rien n'a été trouvé sur ce produit</h2>
            <img src="/pictures/noData.svg" alt="" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
