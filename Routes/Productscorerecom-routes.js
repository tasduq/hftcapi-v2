const express = require("express");

const productScoreRecomController = require("../controllers/productscorerecom-controllers");

const router = express.Router();

router.post("/add", productScoreRecomController.addList);
router.get("/get", productScoreRecomController.getLists);
router.post("/getsinglelist", productScoreRecomController.getSingleList);

module.exports = router;
