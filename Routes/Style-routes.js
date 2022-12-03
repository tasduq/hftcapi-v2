const express = require("express");

const styleController = require("../controllers/style-controllers");

const router = express.Router();

router.post("/addstyle", styleController.addStyle);
router.post("/getstyleimages", styleController.getStyleImages);
router.get("/getstyles", styleController.getStyles);
router.post("/editstyle", styleController.editStyle);
router.post("/deletestyle", styleController.deleteStyle);

module.exports = router;
