const express = require("express");

const productUseController = require("../controllers/productuse-controllers");

const router = express.Router();

router.post("/addproductuse", productUseController.addProductUse);
router.post("/getuserproductuse", productUseController.getProductUse);
router.post("/getproductuseimage", productUseController.getProductUseImage);

module.exports = router;
