const express = require("express");

const salonController = require("../controllers/salon-controllers");

const router = express.Router();

router.post("/addsalon", salonController.addSalon);
router.post("/getsalonimages", salonController.getSalonImages);
router.get("/getsalons", salonController.getSalons);
router.post("/editsalon", salonController.editSalon);
router.post("/deletesalon", salonController.deleteSalon);

module.exports = router;
