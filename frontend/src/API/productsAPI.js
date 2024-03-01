import axios from "axios";

export const getProductFromSearch = async (searchValue) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(
      `${server}/products?search=${searchValue}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
};

export const getProductById = async (id) => {
  try {
    const server = import.meta.env.VITE_SERVER_ADDRESS;
    const response = await axios.get(`${server}/products/getProduct/?id=${id}`);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
  }
};
