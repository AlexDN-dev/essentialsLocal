import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/global/Navbar";
import { Footer } from "../Components/global/Footer";
import { CustomButton } from "../Components/CustomButton";
import "../Styles/views/product.css";
import { getProductById } from "../API/productsAPI";
import { saveToLocalStorage } from "../utils/localStorageUtils";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Product = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const { productId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedValue, setSelectedValue] = useState(1);

  const handleSelectChange = (event) => {
    setSelectedValue(parseInt(event.target.value, 10));
  };

  const server = import.meta.env.VITE_SERVER_ADDRESS;

  const handleCart = () => {
    const savedData = {
      id: product.id,
      name: product.name,
      farmId: product.owner,
      quantity: selectedValue,
      weight: selectedOption,
      image: "http://localhost:3000/products/" + product.picture + ".png",
      price: getSelectedPrice(),
    };
    saveToLocalStorage("cart", savedData);
    console.log(localStorage.getItem("cart"));

    toast.success("Produit ajouté au panier !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const data = await getProductById(productId);
        if (data.rows && data.rows.length > 0) {
          setProduct(data.rows[0]);
          const optionsArray = data.rows[0].options
            .split(":")
            .flatMap(parseOption);
          setProductOptions(optionsArray);
        } else {
          console.error("Aucune donnée de produit disponible.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [productId]);
  const parseOption = (inputString) => {
    if (!inputString || typeof inputString !== "string") {
      console.error("Entrée invalide. Veuillez fournir une chaîne valide.");
      return [];
    }
    const keyValuePairs = inputString.slice(1, -1).split(",");
    const resultArray = keyValuePairs.map((pair) => {
      const [key, value] = pair
        .trim()
        .replace(/"/g, "")
        .split("-")
        .map((item) => item.trim());
      return [key, parseInt(value)];
    });
    return resultArray;
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const getSelectedPrice = () => {
    const selectedOptionObj = productOptions.find(
      (option) => option[0] === selectedOption
    );
    return selectedOptionObj ? selectedOptionObj[1] : product.price;
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="product">
        <div className="productContainer">
          {product && product.picture && (
            <img src={`${server}/products/${product.picture}.png`} alt="" />
          )}
          <div className="productInformation">
            {isLoading ? (
              <div className="loading">
                <img src="/gif/loader.gif" alt="loader" />
                <p>Chargement du produit...</p>
              </div>
            ) : product ? (
              <>
                <p>{product.name}</p>
                <span>{product.desc}</span>
                <div className="optionsContainer">
                  {productOptions.map((option, index) => (
                    <React.Fragment key={index}>
                      <input
                        type="radio"
                        id={index}
                        value={option[0]}
                        name="weightOption"
                        checked={selectedOption === option[0]}
                        onChange={handleOptionChange}
                      />
                      <label htmlFor={index}>{`${option[0]}`}</label>
                    </React.Fragment>
                  ))}
                  <div className="quantityContainer">
                    <h3>Quantité</h3>
                    <select
                      id="mySelect"
                      value={selectedValue}
                      onChange={handleSelectChange}
                    >
                      {[...Array(10)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedOption && (
                  <Fragment>
                    <p className="price">{getSelectedPrice()} €</p>
                    <CustomButton
                      text={"Ajouter"}
                      onClick={handleCart}
                    ></CustomButton>
                  </Fragment>
                )}
              </>
            ) : (
              <div className="no-results">
                <h2>Rien n'a été trouvé sur ce produit</h2>
                <img src="/pictures/noData.svg" alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
