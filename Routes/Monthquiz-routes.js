const express = require("express");

const monthQuizController = require("../controllers/monthquiz-controllers");

const router = express.Router();

router.get("/getquestions", monthQuizController.getQuestions);
router.post("/addquestion", monthQuizController.addQuestion);
router.post("/editquestion", monthQuizController.editQuestion);
router.post("/deletequestion", monthQuizController.deleteQuestion);
router.post("/savequizresult", monthQuizController.saveQuizResult);
router.post("/getquizresult", monthQuizController.getQuizResult);

module.exports = router;
