const express = require("express");

const quizController = require("../controllers/quiz-controllers");

const router = express.Router();

router.get("/getquestions", quizController.getQuestions);
router.get("/getfirstquestion", quizController.getFirstQuestion);
router.post("/getnextquestion", quizController.getNextQuestion);
router.post("/addquestion", quizController.addQuestion);
router.post("/connectquestion", quizController.connectQuestions);
router.post("/editquestion", quizController.editQuestion);
router.delete("/deletequiz", quizController.deleteQuiz);
router.post("/savequizresult", quizController.saveQuizResult);
router.post("/getquizresult", quizController.getQuizResult);

module.exports = router;
