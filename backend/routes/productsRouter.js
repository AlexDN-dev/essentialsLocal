const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");

router.get("/", productsController.getProductsFromSearch);
router.get("/getProduct", productsController.getProductById);

module.exports = router;
