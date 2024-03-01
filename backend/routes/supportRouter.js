const express = require("express");
const router = express.Router();

const supportController = require("../controllers/supportController");

router.post("/farmRequest", supportController.postFarmRequest);
router.get("/farmRequest", supportController.getFarmRequest);
router.post("/anwersFarms", supportController.anwersFarms);
router.post("/addDeliverer", supportController.addDeliverer);
router.post("/getDeliverer", supportController.getDeliverer);
router.post("/removeDeliverer", supportController.removeDeliverer);

module.exports = router;
