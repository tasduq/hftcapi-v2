const express = require("express");

const goalsController = require("../controllers/goals-controllers");

const router = express.Router();

router.post("/addgoal", goalsController.addGoal);
router.post("/getusergoals", goalsController.getUserGoals);
router.post("/completegoal", goalsController.completeGoal);
router.post("/uncompletegoal", goalsController.unCompleteGoal);
router.post("/deletegoal", goalsController.deleteGoal);

module.exports = router;
