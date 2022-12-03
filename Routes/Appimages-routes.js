const express = require("express");

const appImagesController = require("../controllers/appimages-controllers");

const router = express.Router();

router.post("/addappimage", appImagesController.addAppImage);
// router.post("/getsalonimages", salonController.getSalonImages);
router.get("/getappimages", appImagesController.getAppImages);
// router.post("/editsalon", salonController.editSalon);
// router.post("/deletesalon", salonController.deleteSalon);

module.exports = router;
