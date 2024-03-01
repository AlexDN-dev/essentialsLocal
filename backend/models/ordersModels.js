const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "essentials",
  password: "test123*",
  port: 5432,
});

const getUserOrders = async (mail) => {
  try {
    const response = await pool.query(
      'SELECT * FROM "order" WHERE "author" = $1 AND "status" != -1 ORDER BY "id"',
      [mail]
    );
    return response.rows;
  } catch (error) {
    throw error;
  }
};
const getOrderDetails = async (orderId) => {
  try {
    const response = await pool.query(
      'SELECT * FROM "order_item" WHERE "orderid" = $1',
      [orderId]
    );
    return response.rows;
  } catch (error) {
    throw error;
  }
};
const getOrdersByOrderId = async (orderId) => {
  try {
    response = await pool.query('SELECT * FROM "order" WHERE "id" = $1', [
      orderId,
    ]);
    return response.rows[0];
  } catch (error) {
    throw error;
  }
};
const getOrderByProductId = async (productIds) => {
  try {
    const response = await pool.query(
      'SELECT * FROM "order_item" WHERE "productid" = ANY($1)',
      [productIds]
    );

    return response.rows;
  } catch (error) {
    throw error;
  }
};

const setOrderReady = async (id) => {
  try {
    await pool.query('UPDATE "order" SET status = 2 WHERE "id" = $1', [id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserOrders,
  getOrderDetails,
  getOrdersByOrderId,
  getOrderByProductId,
  setOrderReady,
};
