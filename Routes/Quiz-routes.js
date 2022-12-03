const express = require("express");

const quizController = require("../controllers/quiz-controllers");

const router = express.Router();

router.get("/getquestions", quizController.getQuestions);
router.post("/addquestion", quizController.addQuestion);
router.post("/editquestion", quizController.editQuestion);
router.post("/deletequestion", quizController.deleteQuestion);
router.post("/savequizresult", quizController.saveQuizResult);
router.post("/getquizresult", quizController.getQuizResult);

module.exports = router;
