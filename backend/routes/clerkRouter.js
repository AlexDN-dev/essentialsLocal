const express = require("express");
const router = express.Router();

const clerkController = require("../controllers/clerkController");

router.get("/", clerkController.getAllUser);
router.post("/switchStatut", clerkController.switchStatut);
router.post("/isAdmin", clerkController.isAdmin);
router.post("/getOrders", clerkController.getOrders);
router.post("/getOrderDetails", clerkController.getOrderDetails);

module.exports = router;
