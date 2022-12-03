const express = require("express");

const salonVisitController = require("../controllers/salonvisit-controllers");

const router = express.Router();

router.post("/addsalonvisit", salonVisitController.addSalonVisit);
router.post("/getusersalonvisit", salonVisitController.getSalonVisit);
router.post("/getsalonvisitimage", salonVisitController.getSalonVisitImage);

module.exports = router;
