const express = require("express");

const quotesController = require("../controllers/quotes-controllers");

const router = express.Router();

router.post("/addquote", quotesController.addQuote);
router.post("/editquote", quotesController.editquote);
router.post("/deletequote", quotesController.deleteQuote);
router.get("/getquotes", quotesController.getQuotes);
router.post("/getquote", quotesController.getQuote);

module.exports = router;
