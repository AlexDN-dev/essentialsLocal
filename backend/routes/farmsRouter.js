const express = require("express");
const router = express.Router();
const farmsController = require("../controllers/farmsController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    req.tempData = req.body;
    cb(null, "public/farms");
  },
  filename: (req, file, cb) => {
    cb(null, req.tempData.id + ".png");
  },
});

const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    req.tempData = req.body;
    cb(null, "public/products");
  },
  filename: (req, file, cb) => {
    const name = req.tempData.name;
    const formattedName = name.replace(/\s+/g, "_");
    cb(null, req.tempData.farmId + "_" + formattedName + ".png");
  },
});

const uploadProduct = multer({
  storage: storageProduct,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Seules les images sont autorisées."));
      }
    }
    cb(null, true);
  },
});

const upload = multer({ storage });

router.get("/", farmsController.getFarmsByLocation);
router.get("/getFarm", farmsController.getFarmById);
router.get("/getAllFarms", farmsController.getAllFarms);
router.put("/switchStatut", farmsController.switchFarmStatut);
router.get("/hasFarm", farmsController.hasFarm);
router.get("/getProducts", farmsController.getProducts);
router.post("/getAddress", farmsController.getAddress);
router.post("/canDelivery", farmsController.canDelivery);
router.post(
  "/addProduct",
  uploadProduct.single("image"),
  farmsController.addProduct
);

router.post("/updateFarm", upload.single("image"), farmsController.updateFarm);

router.post("/create-checkout-session", farmsController.createCheckoutSession);
router.post("/cancelPayement", farmsController.cancelPayement);
router.post("/successPayement", farmsController.successPayement);

router.post("/getFarmOrders", farmsController.getFarmOrders);
router.post("/getFarmOrderDetails", farmsController.getFarmOrderDetails);
router.post("/confirmFarmOrder", farmsController.confirmFarmOrder);
router.post("/checkQuantity", farmsController.checkQuantity);
router.post("/deleteProduct", farmsController.deleteProduct);

module.exports = router;
