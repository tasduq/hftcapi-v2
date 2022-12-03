const Quiz = require("../Models/Monthquiz");
const User = require("../Models/User");
const Quizresult = require("../Models/Weekquizresult");
const Productsscoresecom = require("../Models/Productscorerecom");
const Product = require("../Models/Product");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.tz = "Etc/GMT+5";

const job = schedule.scheduleJob(rule, function () {
  console.log("A new day has begun in the UTC timezone!");
  sendEmailOtp("tasduqali2@gmail.com", "1234 New day Email");
});

const job2 = schedule.scheduleJob(
  { hour: 19, minute: 2, dayOfWeek: 4 },
  function () {
    console.log("Time for tea!");
    sendEmailOtp("tasduqali2@gmail.com", "1234");
  }
);
console.log(job2);

const sendEmailOtp = (email, otp) => {
  console.log(email, otp, "hello gggggg");
  if (otp && email) {
    console.log("Things going good");
    const output = `
              <p>You Email Verification code</p>
              <h3>Hair For The Culture</h3>
              <ul>  
                <li>Registered for: ${email}</li>
              </ul>
              <h3> Your OTP for email Verification is</h3>
              <p>${otp}</p>
              `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.google.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      service: "gmail",
      auth: {
        user: "contact@technoush.com", // generated ethereal user
        pass: "npakzcfbovcqxwxn", // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"HFTC" <contact@technoush.com>', // sender address
      to: email, // list of receivers
      subject: "Email Verification", // Subject line
      // text: details, // plain text body
      html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error, "I am error");
        return error;
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // let emailOtp = new Emailotp({
        //   email,
        //   otp,
        // });
        // await emailOtp.save();
        // res.status(200).json({ message: "Check Your Email" });
        // return true;
      }
    });
    return true;
  } else {
    // res.status(401).json({ message: "Something went Wrong" });
    console.log("Otp and email not available");
    return false;
  }
};

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
      message: "This is User Week Result",
      result: result,
    });
  } else {
    res.json({ success: false, message: "User Weekily result not found" });
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
