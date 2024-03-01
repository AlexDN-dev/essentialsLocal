const { Pool } = require("pg");
const ordersModels = require("../models/ordersModels");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "essentials",
  password: "test123*",
  port: 5432,
});

const getAllFarms = async () => {
  try {
    const farms = await pool.query(
      'SELECT * FROM farm WHERE "isAvailable" = 1 OR "isAvailable" = 0'
    );
    return farms.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits : ", error);
    throw error;
  }
};

const getAllFarmsAvailable = async () => {
  try {
    const farms = await pool.query(
      'SELECT * FROM farm WHERE "isAvailable" = 1'
    );
    return farms.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits : ", error);
    throw error;
  }
};

const getFarmById = async (id) => {
  try {
    const farm = await pool.query("SELECT * FROM farm WHERE id = $1", [id]);
    return farm.rows;
  } catch (error) {
    console.log("Erreur lors de la récupération de la ferme : ", error);
  }
};
const switchFarmStatut = async (id, value) => {
  try {
    await pool.query('UPDATE farm SET "isAvailable" = $1 WHERE id = $2', [
      value,
      id,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const postFarmRequest = async (data, schedule) => {
  try {
    const query = `INSERT INTO farm (owner, name, address, schedule, "desc", "isAvailable")VALUES ($1, $2, $3, $4, $5, $6)`;
    await pool.query(query, [
      data.email,
      data.farmName,
      data.address,
      schedule,
      data.description,
      -1,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getFarmRequest = async () => {
  try {
    const farmRequest = await pool.query(
      'SELECT * FROM farm WHERE "isAvailable" = -1'
    );
    return farmRequest.rows;
  } catch (error) {
    return error;
  }
};

const addFarmCoordonnate = async (farmID, latitude, longitude) => {
  try {
    await pool.query(
      "UPDATE farm SET latitude = $1, longitude = $2 WHERE id = $3",
      [latitude, longitude, farmID]
    );
  } catch (error) {
    return error;
  }
};

const hasFarm = async (address) => {
  try {
    const request = await pool.query("SELECT * FROM farm WHERE owner = $1", [
      address,
    ]);
    return request.rows;
  } catch (error) {
    console.error("Error executing SQL query:", error.message);
  }
};

const updateFarm = async (data) => {
  try {
    const query = {
      text: `
        UPDATE farm
        SET name = $1, "phoneNumber" = $2, "desc" = $3, schedule = $4
        WHERE id = $5
      `,
      values: [data.name, data.phoneNumber, data.desc, data.schedule, data.id],
    };

    await pool.query(query);
  } catch (error) {
    console.error("Error updating farm:", error);
  }
};
const getProducts = async (id) => {
  try {
    const request = await pool.query(
      "SELECT * FROM product WHERE owner = $1 AND status = 1",
      [id]
    );
    return request.rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits : ", error);
  }
};
const addProduct = async (data, image) => {
  try {
    const price = data.price !== "" ? data.price : null;
    const query =
      'INSERT INTO product (name, quantity, price, picture, owner, keyword, options, "desc") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    await pool.query(query, [
      data.name,
      data.stock,
      price,
      image,
      data.farmId,
      data.keywords,
      data.quantity,
      data.description,
    ]);
  } catch (error) {
    console.log(error);
  }
};
const getAddress = async (farmIds) => {
  try {
    const placeholders = farmIds.map((_, index) => `$${index + 1}`).join(",");

    const queryString = `
      SELECT id, name, address, owner
      FROM farm
      WHERE id IN (${placeholders})
    `;
    const response = await pool.query(queryString, farmIds);
    return response.rows;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des adresses de ferme :",
      error
    );
    throw error;
  }
};

const createOrder = async (stripeId, totalPrice, author, delivery) => {
  try {
    const query =
      'INSERT INTO "order" ("stripeId", "totalPrice", "author", "delivery") VALUES ($1, $2, $3, $4)';
    await pool.query(query, [stripeId, totalPrice, author, delivery]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateStatusOrder = async (stripeId, status) => {
  try {
    await pool.query('UPDATE "order" SET "status" = $1 WHERE "stripeId" = $2', [
      status,
      stripeId,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getOrderByStripeId = async (stripeId) => {
  try {
    const response = await pool.query(
      'SELECT * FROM "order" WHERE "stripeId" = $1',
      [stripeId]
    );
    return response.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProductsToDB = async (cart, orderId) => {
  try {
    for (const product of cart) {
      await pool.query(
        'INSERT INTO "order_item" ("orderid", "productid", "quantity", "weight") VALUES ($1, $2, $3, $4)',
        [orderId, product.id, product.quantity, product.weight]
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const confirmFarmOrder = async (products, orderId) => {
  const queryString = `
    UPDATE "order_item"
    SET "status" = 1
    WHERE "orderid" = $1
    AND "productid" IN (${products
      .map((_, index) => `$${index + 2}`)
      .join(", ")})
  `;
  const queryParams = [orderId, ...products];
  await pool.query(queryString, queryParams);

  const countQueryString = `
    SELECT COUNT(*) AS count
    FROM "order_item"
    WHERE "orderid" = $1
    AND "status" = 1
  `;
  const countQueryParams = [orderId];
  const { rows } = await pool.query(countQueryString, countQueryParams);
  const orderDetails = await ordersModels.getOrderDetails(orderId);
  if (parseInt(rows[0].count) === orderDetails.length) {
    return true;
  } else {
    return false;
  }
};
const checkQuantity = async (productId, quantity) => {
  try {
    const product = await pool.query(
      'SELECT "quantity" FROM "product" WHERE "id" = $1',
      [productId]
    );
    const stock = product.rows[0].quantity;
    if (stock < quantity) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const removeQuantity = async (productId, quantity) => {
  try {
    const product = await pool.query(
      'SELECT "quantity" FROM "product" WHERE "id" = $1',
      [productId]
    );
    const stock = product.rows[0].quantity;
    const finalStock = stock - quantity;
    await pool.query('UPDATE "product" SET "quantity" = $1 WHERE "id" = $2', [
      finalStock,
      productId,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deleteProduct = async (id) => {
  try {
    await pool.query('UPDATE "product" SET "status" = 0 WHERE "id" = $1', [id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getAllFarms,
  getFarmById,
  getAllFarmsAvailable,
  switchFarmStatut,
  postFarmRequest,
  getFarmRequest,
  addFarmCoordonnate,
  hasFarm,
  updateFarm,
  getProducts,
  addProduct,
  getAddress,
  createOrder,
  updateStatusOrder,
  getOrderByStripeId,
  addProductsToDB,
  confirmFarmOrder,
  checkQuantity,
  removeQuantity,
  deleteProduct,
};
