const productModels = require("../models/productsModels");

const getProductsFromSearch = async (req, res, next) => {
  const searchValue = req.query.search;
  try {
    const products = await productModels.getProductsFromSearch(searchValue);

    if (products === null) {
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

const getProductById = async (req, res, next) => {
  const id = req.query.id;
  try {
    const productDetails = await productModels.getProductById(id);
    return res.status(200).json(productDetails);
  } catch (error) {
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

module.exports = {
  getProductsFromSearch,
  getProductById,
};
