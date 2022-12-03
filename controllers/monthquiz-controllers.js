const Quiz = require("../Models/Monthquiz");
const User = require("../Models/User");
const Quizresult = require("../Models/Monthquizresult");
const Productsscoresecom = require("../Models/Productscorerecom");
const Product = require("../Models/Product");

const addQuestion = async (req, res) => {
  console.log(req.body);
  const { question, option1, option2, option3 } = req.body;

  const createdQuestion = new Quiz({
    question,
    option1,
    option2,
    option3,
  });

  try {
    createdQuestion.save((err) => {
      if (err) {
        res.json({
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
    res.json({
      success: false,
      data: err,
      message: "Creating Question failed",
    });
  }
};

const editQuestion = async (req, res) => {
  const { question, option1, option2, option3, _id } = req.body;

  try {
    let updatedQuestion = Quiz.updateOne(
      { _id: _id },

      {
        $set: { question, option1, option2, option3 },
      }
    )
      .then((response) => {
        console.log(response);
        res.json({ success: true, message: "Question Updated" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ success: false, message: "Question  Updating Error" });
      });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error Saving ImagesS",
    });
  }
};

const deleteQuestion = async (req, res) => {
  console.log(req.body);

  const { id } = req.body;

  console.log(id);

  try {
    let quiz = await Quiz.deleteOne({ _id: id });
    res.json({ success: true, message: "Question deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const getQuestions = async (req, res) => {
  const questions = await Quiz.find({});
  if (questions) {
    res.json({
      success: true,
      questions,
      message: "Questions Found",
    });
    return;
  } else {
    res.json({
      success: false,
      message: "Questions not Found",
    });
    return;
  }
};

const saveQuizResult = async (req, res) => {
  const { answers, result, userId } = req.body;
  console.log(result, "This is result");

  const previousResult = await Quizresult.findOne({ user: userId });
  if (previousResult) {
    let updatedResult = Quizresult.updateOne(
      { user: userId },

      {
        $set: { answers: answers, result: result },
      }
    )
      .then((response) => {
        console.log(response);
        console.log("Weekly Result Updated");
        User.updateOne(
          { _id: userId },
          { $set: { latestResult: previousResult._id } },
          async function (err) {
            if (!err) {
              console.log("User result Updated");
              //   return res.json({
              //     success: true,
              //     message: "User result Updated",
              //   });
              console.log({ message: "Result Saved" });
              let productsIds;
              if (result === 1) {
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
                  res.json({
                    success: false,
                    message: "Products fecthing Failed",
                    data: err,
                  });
                }
              } else if (result === 2) {
                productsIds = await Productsscoresecom.findOne({
                  name: "2",
                });
                console.log(productsIds, "This are products Ids");
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
                  res.json({
                    success: false,
                    message: "Products fecthing Failed",
                    data: err,
                  });
                }
              } else if (result === 3) {
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
                  res.json({
                    success: false,
                    message: "Products fecthing Failed",
                    data: err,
                  });
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
        // res.json({ success: true, message: "Weekly Result Updated" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ success: false, message: "Weekly Result Updating Error" });
      });
  } else {
    if (answers && result && userId) {
      const createdQuizResult = new Quizresult({
        answers: answers,
        result,
        user: userId,
      });
      try {
        createdQuizResult.save(async (err, data) => {
          if (err) {
            res.json({
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
                  if (result === 1) {
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
                      res.json({
                        success: false,
                        message: "Products fecthing Failed",
                        data: err,
                      });
                    }
                  } else if (result === 2) {
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
                      res.json({
                        success: false,
                        message: "Products fecthing Failed",
                        data: err,
                      });
                    }
                  } else if (result === 3) {
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
                      res.json({
                        success: false,
                        message: "Products fecthing Failed",
                        data: err,
                      });
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
      res.json({
        success: false,
        message: "All fields are required",
      });
    }
  }
};

const getQuizResult = async (req, res) => {
  const { userId } = req.body;

  const result = await Quizresult.findOne({ user: userId });
  if (result) {
    res.json({
      success: true,
      message: "This is User Monthly Result",
      result: result,
    });
  } else {
    res.json({ success: false, message: "User Monthly result not found" });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  saveQuizResult,
  editQuestion,
  deleteQuestion,
  getQuizResult,
};
