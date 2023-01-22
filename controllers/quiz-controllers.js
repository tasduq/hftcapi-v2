const Quiz = require("../Models/Quiz");
const Quizresult = require("../Models/Quizresult");
const Productsscoresecom = require("../Models/Productscorerecom");
const Product = require("../Models/Product");
const User = require("../Models/User");
const { v4: uuidv4 } = require("uuid");

const addQuestion = async (req, res) => {
  console.log(req.body);
  const { question, options, tips, firstQuestion, lastQuestion } = req.body;

  // let optionsInitialization = options.map((option) => {
  //   return { ...option, optionId: uuidv4() };
  // });

  if (firstQuestion) {
    let firstQuestionFound = await Quiz.findOne({ firstQuestion: true });
    console.log(firstQuestionFound, "i am first question");
    if (firstQuestionFound) {
      res.status(400).json({
        success: false,
        message: "Only one question can be choosed as first",
      });
      return;
    }
  }

  const createdQuestion = new Quiz({
    question,
    options: options,
    tips,
    firstQuestion: firstQuestion ? firstQuestion : false,
    lastQuestion: lastQuestion,
  });

  try {
    createdQuestion.save((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          data: err,
          message: "Creating Question failed",
        });
        return;
      } else {
        console.log({ message: "Question created", createdQuestion });

        res.status(200).send({
          message: "Question created",
          success: true,
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: "Question creation failed",
      success: false,
    });
  }
};

const connectQuestions = async (req, res) => {
  const { questionId, options } = req.body;
  console.log(questionId, options);

  try {
    let updatedQuestion = Quiz.updateOne(
      { _id: questionId },

      {
        $set: { options },
      }
    )
      .then((response) => {
        console.log(response);
        res.status(200).json({ success: true, message: "Question Connected" });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ success: false, message: "Question  Updating Error" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Somthing went wrong while connecting the question",
    });
  }
};

const editQuestion = async (req, res) => {
  console.log(req.body);
  const { question, options, tips, firstQuestion, _id, lastQuestion } =
    req.body;

  // let optionsInitialization = options.map((option) => {
  //   return { ...option, optionId: uuidv4() };
  // });

  if (firstQuestion) {
    let firstQuestionFound = await Quiz.findOne({ firstQuestion: true });
    console.log(firstQuestionFound, "i am first question");
    if (firstQuestionFound && firstQuestionFound._id.toString() !== _id) {
      res.status(400).json({
        success: false,
        message: "Only one question can be choosed as first",
      });
      return;
    }
  }

  Quiz.updateOne(
    { _id: _id },

    {
      $set: { question, options, tips, firstQuestion, _id, lastQuestion },
    }
  )
    .then((response) => {
      console.log(response);
      res.status(200).json({ success: true, message: "Question Updated" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Question  Updating Error" });
    });
};

const deleteQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.remove({});
    res.status(200).json({ success: true, message: "Quiz deleted" });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Deleteing Quiz Failed" });
    return;
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Quiz.find({});
    res.status(200).json({
      success: true,
      questions,
      message: "Questions Found",
    });
    return;
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const getFirstQuestion = async (req, res) => {
  try {
    let question = await Quiz.findOne({ firstQuestion: true });
    res.status(200).json({
      message: "First question found",
      success: true,
      question: question,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const getNextQuestion = async (req, res) => {
  const { questionId } = req.body;
  try {
    let question = await Quiz.findOne({ _id: questionId });
    res.status(200).json({
      message: "Next Question",
      success: true,
      question: question,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const saveQuizResult = async (req, res) => {
  const { answers, result, userId } = req.body;

  if (answers && result && userId) {
    const createdQuizResult = new Quizresult({
      answers: answers,
      result,
      user: userId,
    });
    try {
      createdQuizResult.save(async (err, data) => {
        if (err) {
          res.status(500).json({
            success: false,
            data: err,
            message: "Result saving failed",
          });
          return;
        } else {
          User.updateOne(
            { _id: userId },
            { $set: { latestResult: data._id } },
            async function (err) {
              if (!err) {
                console.log("User result Updated");
                //   return res.json({
                //     success: true,
                //     message: "User result Updated",
                //   });
                console.log({ message: "Result Saved" });
                let productsIds;
                if (result < 4) {
                  productsIds = await Productsscoresecom.findOne({
                    name: "1",
                  });
                  console.log(productsIds);
                  try {
                    let products = await Product.find({
                      _id: productsIds.products,
                    });
                    res.status(200).send({
                      message: "Your Result is saved",
                      success: true,
                      products,
                    });
                    return;
                  } catch (err) {
                    console.log(err);
                    res.status(500).json({
                      success: false,
                      message: "Products fecthing Failed",
                      data: err,
                    });
                    return;
                  }
                } else if (result >= 4 && result < 8) {
                  productsIds = await Productsscoresecom.findOne({
                    name: "2",
                  });
                  console.log(productsIds);
                  try {
                    let products = await Product.find({
                      _id: productsIds.products,
                    });
                    res.status(200).send({
                      message: "Your Result is saved",
                      success: true,
                      products,
                    });
                    return;
                  } catch (err) {
                    console.log(err);
                    res.status(500).json({
                      success: false,
                      message: "Products fecthing Failed",
                      data: err,
                    });
                    return;
                  }
                } else if (result > 8 && result <= 10) {
                  productsIds = await Productsscoresecom.findOne({
                    name: "3",
                  });
                  try {
                    let products = await Product.find({
                      _id: productsIds.products,
                    });
                    res.status(200).send({
                      message: "Your Result is saved",
                      success: true,
                      products,
                    });
                    return;
                  } catch (err) {
                    console.log(err);
                    res.status(500).json({
                      success: false,
                      message: "Products fecthing Failed",
                      data: err,
                    });
                    return;
                  }
                }
              } else {
                res.json({
                  success: false,
                  message: "Saving user result failed",
                });
                return;
              }
            }
          );
        }
      });
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Result Saving failed",
      });
      return;
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Some fields are missing",
    });
  }
};

const getQuizResult = async (req, res) => {
  const { userId } = req.body;

  const result = await Quizresult.findOne({ user: userId });
  if (result) {
    res.json({
      success: true,
      message: "This is User First Result",
      result: result,
    });
  } else {
    res.json({ success: false, message: "User result not found" });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  saveQuizResult,
  editQuestion,
  deleteQuiz,
  getQuizResult,
  connectQuestions,
  getNextQuestion,
  getFirstQuestion,
};
