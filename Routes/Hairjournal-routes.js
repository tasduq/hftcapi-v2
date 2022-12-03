const express = require("express");

const hairJournalController = require("../controllers/hairjournal-controllers");

const router = express.Router();

router.post("/addjournal", hairJournalController.addJournal);
router.post("/getuserjournal", hairJournalController.getUserJournal);
router.post("/getjournalimage", hairJournalController.getJournalImage);

module.exports = router;
