const Goals = require("../Models/Goals");
const Images = require("../Models/Images");
var dateTime = require("node-datetime");
const { v4: uuidv4 } = require("uuid");

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

const addGoal = async (req, res) => {
  const { userId, description, date } = req.body;
  console.log(userId, description);

  if (userId && date && description) {
    const foundUserGoal = await Goals.findOne({ user: userId });
    // console.log(foundUserGoal);

    if (foundUserGoal) {
      let completedGoals = 0;
      let totalQuestions = foundUserGoal.list.length + 1;

      let yoo = foundUserGoal.list.map((subGoal) => {
        if (subGoal.completed === true) {
          completedGoals = completedGoals + 1;
        }
      });
      let result = (completedGoals / totalQuestions) * 100;
      console.log(result);
      Goals.updateOne(
        { user: userId },
        {
          $set: {
            list: [
              ...foundUserGoal.list,
              {
                id: uuidv4(),
                description,
                date: date,
                completed: false,
              },
            ],
            result: result,
          },
        },
        async (err) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "Error Adding Goal",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Goal Added ",
            });
            return;
          }
        }
      );
    } else {
      const createdGoal = new Goals({
        user: userId,
        list: [
          {
            id: uuidv4(),
            description,
            completed: false,
            date: date,
          },
        ],
        result: 0,
      });
      createdGoal.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            sucess: false,
            message: "Goal Creation failed",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Goal Added",
          });
          return;
        }
      });
    }
  } else {
    res.json({
      success: false,
      message: "User id and Description of goal required",
    });
  }
};

const getUserGoals = async (req, res) => {
  console.log("getting");
  const { userId } = req.body;
  const foundUserGoal = await Goals.findOne({ user: userId });
  // console.log(salons);

  if (foundUserGoal) {
    res.json({
      success: true,
      foundUserGoal,
      message: "User Goal Found",
    });
  } else {
    res.json({
      success: false,
      message: "No Goal Exist for this user",
    });
  }
};

const completeGoal = async (req, res) => {
  const { userId, goal } = req.body;
  const foundUserGoal = await Goals.findOne({ user: userId });
  if (foundUserGoal) {
    let updatedList = foundUserGoal.list.map((subList) => {
      if (subList.id === goal.id) {
        return { ...goal, completed: true };
      } else {
        return subList;
      }
    });
    console.log(updatedList);
    let completedGoals = 0;
    let totalQuestions = updatedList.length;

    let yoo = updatedList.map((subGoal) => {
      if (subGoal.completed === true) {
        completedGoals = completedGoals + 1;
      }
    });
    let result = (completedGoals / totalQuestions) * 100;
    console.log(result);
    Goals.updateOne(
      { user: userId },
      {
        $set: {
          list: updatedList,
          result: result,
        },
      },
      async (err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Error Completing Goal",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Goal Completed hurrah ",
          });
          return;
        }
      }
    );
  }
};

const unCompleteGoal = async (req, res) => {
  const { userId, goal } = req.body;
  const foundUserGoal = await Goals.findOne({ user: userId });
  if (foundUserGoal) {
    let updatedList = foundUserGoal.list.map((subList) => {
      if (subList.id === goal.id) {
        return { ...goal, completed: false };
      } else {
        return subList;
      }
    });
    console.log(updatedList);
    let completedGoals = 0;
    let totalQuestions = updatedList.length;

    let yoo = updatedList.map((subGoal) => {
      if (subGoal.completed === true) {
        completedGoals = completedGoals + 1;
      }
    });
    let result = (completedGoals / totalQuestions) * 100;
    console.log(result);
    Goals.updateOne(
      { user: userId },
      {
        $set: {
          list: updatedList,
          result: result,
        },
      },
      async (err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Error UnChecked Goal",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Goal UnChecked ",
          });
          return;
        }
      }
    );
  }
};

const deleteGoal = async (req, res) => {
  const { userId, goal } = req.body;
  const foundUserGoal = await Goals.findOne({ user: userId });
  if (foundUserGoal) {
    let updatedList = foundUserGoal.list.filter((subList) => {
      return subList.id !== goal.id;
    });
    let completedGoals = 0;
    let totalQuestions = updatedList.length;

    let yoo = updatedList.map((subGoal) => {
      if (subGoal.completed === true) {
        completedGoals = completedGoals + 1;
      }
    });
    let result = (completedGoals / totalQuestions) * 100;
    Goals.updateOne(
      { user: userId },
      {
        $set: {
          list: updatedList,
          result: result,
        },
      },
      async (err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Error Deleting Goal",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Goal Deleted ",
          });
          return;
        }
      }
    );
  }
};

module.exports = {
  addGoal,
  getUserGoals,
  completeGoal,
  deleteGoal,
  unCompleteGoal,
};
