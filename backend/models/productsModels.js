require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "essentials",
  password: "test123*",
  port: 5432,
});

const getProductsFromSearch = async (searchValue) => {
  try {
    const productResults = await pool.query(
      'SELECT * FROM product WHERE (name ILIKE $1 OR keyword ILIKE $1) AND "quantity" > 0 AND "status" = 1',
      [`%${searchValue}%`]
    );

    return {
      productResults: productResults.rows,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const productDetails = await pool.query(
      "SELECT * FROM product WHERE id = $1",
      [id]
    );
    return productDetails;
  } catch (error) {
    throw error;
  }
};

const getProductsByFarmId = async (id) => {
  try {
    const productList = await pool.query(
      "SELECT * FROM product WHERE owner = $1",
      [id]
    );
    return productList.rows;
  } catch (error) {
    console.log("Erreur lors de la récupération des produits : ", error);
    throw error;
  }
};

module.exports = { getProductsFromSearch, getProductById, getProductsByFarmId };
