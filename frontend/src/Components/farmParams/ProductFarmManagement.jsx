import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { CustomButton } from "../CustomButton";
import DynamicInputs from "../DynamicInputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addProduct, deleteProduct, getAllProducts } from "../../API/farmsAPI";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ProductFarmManagement = ({ data }) => {
  const [productValues, setProductValues] = useState({
    name: "",
    stock: "",
    price: "",
    keywords: "",
    description: "",
    quantities: [],
    image: null,
  });

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const productList = await getAllProducts(data.id);
    setProducts(productList.data);
  };

  useEffect(() => {
    getProducts();
  }, [data.id]);

  const handleInputChange = (name, value) => {
    setProductValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductValues((prevValues) => ({
      ...prevValues,
      image: file,
    }));
  };

  const handleDynamicInputsChange = (quantities) => {
    setProductValues((prevValues) => ({
      ...prevValues,
      quantities,
    }));
  };
  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    toast.success("Produit supprimé !", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
    getProducts();
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Ajouter les champs du produit à FormData
    formData.append("farmId", data.id);
    formData.append("name", productValues.name);
    formData.append("stock", productValues.stock);
    formData.append("price", productValues.price);
    formData.append("keywords", productValues.keywords);
    formData.append("description", productValues.description);
    formData.append("image", productValues.image);
    productValues.quantities.forEach((quantity, index) => {
      formData.append(`quantity[${index}]`, quantity);
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    await addProduct(formData);
    getProducts();
  };
  return (
    <div className="productManagement">
      <ToastContainer />
      <form
        className="addProductContainer"
        encType="multipart/form-data"
        onSubmit={handleAddProduct}
      >
        <h3>Ajouter un produit</h3>
        <div className="imageUpload">
          <h4>Détails du produit</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            name="image"
          />
          <div className="productDetails">
            <p className="textTips">
              Pour les mots clés, merci de les séparés par une virgule.
            </p>
            <input
              type="text"
              placeholder="Nom du produit"
              value={productValues.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Stock actuel"
              value={productValues.stock}
              onChange={(e) => handleInputChange("stock", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Prix à l'unité"
              value={productValues.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            <input
              type="text"
              placeholder="Mots clés"
              value={productValues.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              required
            />
            <textarea
              required
              placeholder="Description du produit"
              value={productValues.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="quantityGestion">
          <DynamicInputs onChange={handleDynamicInputsChange} />
          <CustomButton
            type={"submit"}
            text={"Ajouter le produit"}
            onClick={handleAddProduct}
          />
        </div>
      </form>
      <div className="manageProductContainer">
        <h3>Liste des produits</h3>
        <div className="productListContainer">
          {Array.isArray(products) &&
            products.map((product) => (
              <div key={product.id} className="productFarm">
                <img
                  src={"http://localhost:3000/pictures/product.jpg"}
                  alt={product.name}
                />
                <div className="productDetails">
                  <p>{product.name}</p>
                  <p>{product.quantity} unités</p>
                  <p>{product.price} €</p>
                </div>
                <div>
                  <button
                    className="productFarmButton redButton"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="search-icon"
                      size="lg"
                      color="#ffffff"
                    />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
