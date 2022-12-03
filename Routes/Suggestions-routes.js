const express = require("express");

const suggestionsController = require("../controllers/suggestions-controllers");

const router = express.Router();

router.post("/add", suggestionsController.addList);
router.post("/delete", suggestionsController.deleteSuggestion);
router.get("/get", suggestionsController.getAllLists);
router.post("/getsinglelist", suggestionsController.getSingleList);

module.exports = router;
