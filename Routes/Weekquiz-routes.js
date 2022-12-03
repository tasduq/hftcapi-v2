const express = require("express");

const weekQuizController = require("../controllers/weekquiz-controllers");

const router = express.Router();

router.get("/getquestions", weekQuizController.getQuestions);
router.post("/addquestion", weekQuizController.addQuestion);
router.post("/editquestion", weekQuizController.editQuestion);
router.post("/deletequestion", weekQuizController.deleteQuestion);
router.post("/savequizresult", weekQuizController.saveQuizResult);
router.post("/getquizresult", weekQuizController.getQuizResult);

module.exports = router;
