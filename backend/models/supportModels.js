const { Pool } = require("pg");

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "essentials",
  password: "test123*",
  port: 5432,
});

const addFarmRequest = async (farmId, result, comment) => {
  try {
    const query = `INSERT INTO requestFarm (farmid, result, comment)VALUES ($1, $2, $3)`;
    await pool.query(query, [farmId, result, comment]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addDeliverer = async (deliverer) => {
  try {
    await pool.query(
      "INSERT INTO deliverer (firstname, lastname, mail) VALUES ($1,$2,$3)",
      [deliverer.firstName, deliverer.lastName, deliverer.mail]
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getDeliverer = async () => {
  try {
    return await pool.query('SELECT * FROM "deliverer" WHERE "status" = 1');
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const removeDeliverer = async (id) => {
  try {
    await pool.query('UPDATE "deliverer" SET "status" = 0 WHERE "id" = $1', [
      id,
    ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  addFarmRequest,
  addDeliverer,
  getDeliverer,
  removeDeliverer,
};
