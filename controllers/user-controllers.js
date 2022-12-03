const bcrypt = require("bcryptjs");
var otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Quizresult = require("../Models/Quizresult");
const Weekquizresult = require("../Models/Weekquizresult");
const Monthquizresult = require("../Models/Monthquizresult");
const { JWTKEY } = require("../Config/config");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    res.json({ success: false, message: "Error Geting Users" });
    return;
  }
  res.json({ users: users });
};

const deleteUsers = async (req, res) => {
  console.log(req.body);

  const { id } = req.body;

  console.log(id);

  try {
    let user = await User.deleteOne({ _id: id });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

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

const signup = async (req, res, next) => {
  const { username, email, password, birthday, role } = req.body;
  console.log(req.body);

  if (username && email && password && birthday) {
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });

      if (existingUser) {
        console.log("user already exists");
        res.json({ message: "User Email Already Exists", success: false });
        return;
      }
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      console.log("Signing up failed, please try again later.");

      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    let otpEmail = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    const createdUser = new User({
      username,
      email,
      password: hashedPassword,
      birthday,
      role,
      emailVerificationCode: otpEmail,
    });

    try {
      createdUser.save((err) => {
        if (err) {
          res.json({
            success: false,
            data: err,
            message: "Signing up failed, please try again later.",
          });
          return;
        } else {
          console.log({ message: "user created", createdUser });
          sendEmailOtp(email, otpEmail);

          res.status(200).send({
            message: "Welcome to Hair For The Culture",
            success: true,
          });
        }
      });
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }
  } else {
    res.json({ message: "Please Enter all the Details", success: false });
  }
};

const emailVerify = async (req, res) => {
  const { otp, email } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email }, "-password");
    console.log(user);
    if (user) {
      if (user.emailVerificationCode === otp) {
        User.updateOne(
          { email: email },
          { $set: { emailVerified: true } },
          function (err) {
            if (!err) {
              return res.json({
                success: true,
                message: "Email Verified",
              });
            }
          }
        );
      } else {
        res.json({ success: false, message: "Otp Wrong" });
        return;
      }
    }
  } catch (err) {
    return res.json({ success: false, message: "Somthing went wrong" });
  }
};

const requestNewEmailOtp = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  let user = await User.findOne({ email: email }, "-password");
  if (user) {
    let otpEmail = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    sendEmailOtp(email, otpEmail);

    User.updateOne(
      { email: email },
      { $set: { emailVerificationCode: otpEmail } },
      function (err) {
        if (!err) {
          console.log("Otp Email Updated");
          return res.json({
            success: true,
            message: "New OTP Sent to your email",
          });
        } else {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        }
      }
    );
  } else {
    res.json({
      success: false,
      message: "User Email not exist",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  console.log(email, password);

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  if (!existingUser) {
    res.json({
      success: false,
      message: "User does not exist",
    });

    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  if (!isValidPassword) {
    res.json({
      success: false,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  let access_token;
  try {
    access_token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWTKEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  // console.log(existingUser.notify);

  res.json({
    message: "you are login success fully ",
    username: existingUser.username,
    id: existingUser._id,
    role: existingUser.role,
    email: existingUser.email,
    access_token: access_token,
    success: true,
    emailVerificationCode: existingUser.emailVerificationCode,
    emailVerified: existingUser.emailVerified,
    image: existingUser.image,
    bio: existingUser.bio,
    birthday: existingUser.birthday,
    latestResult: existingUser.latestResult,
  });
};

const newPassword = async (req, res) => {
  console.log(req.body);

  const { newPassword, email, recentOtp } = req.body;
  console.log(newPassword, email, recentOtp, "details");

  if (newPassword && email && recentOtp) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      console.log("Error hashing password", err);

      res.json({
        success: false,
        data: err,
        message: "Something went wrong",
      });
      return;
    }

    // console.log(hashedPassword);

    try {
      let user = await User.findOne({ email: email }, "-password");
      console.log(user);
      if (user) {
        if (user.emailVerificationCode === recentOtp) {
          User.updateOne(
            { email: email },
            { $set: { password: hashedPassword } },
            function (err) {
              if (!err) {
                console.log("Updated");
                return res.json({ success: true, message: "Password Updated" });
              } else {
                // console.log(err);
                res.json({
                  success: false,
                  data: err,
                  message: "Something went wrong",
                });
                return;
              }
            }
          );
        } else {
          res.json({ success: false, message: "Otp Wrong" });
          return;
        }
      } else {
        return res.json({ success: false, message: "Somthing went wrong" });
      }
    } catch (err) {
      return res.json({ success: false, message: "Somthing went wrong" });
    }
  } else {
    res.json({
      success: false,
      message: "Some Details are missing",
    });
  }
};

const editBio = async (req, res) => {
  const { id, bio } = req.body;

  User.updateOne({ _id: id }, { $set: { bio: bio } }, function (err) {
    if (!err) {
      console.log("Bio Updated");
      return res.json({
        success: true,
        message: "Bio Updated",
      });
    } else {
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  });
};

const editUserInfo = async (req, res) => {
  const { id, username, birthday } = req.body;

  if (username && birthday) {
    User.updateOne(
      { _id: id },
      { $set: { username, birthday } },
      function (err) {
        if (!err) {
          console.log("User Info Updated");
          return res.json({
            success: true,
            message: "User info Updated",
          });
        } else {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        }
      }
    );
  } else {
    res.json({
      success: false,
      message: "Both Username and birthday required",
    });
  }
};

const updateUserImage = async (req, res) => {
  const { id, image } = req.body;

  if (id && image) {
    User.updateOne({ _id: id }, { $set: { image, image } }, function (err) {
      if (!err) {
        console.log("User Image Updated");
        return res.json({
          success: true,
          message: "User Image Updated",
        });
      } else {
        res.json({
          success: false,
          message: "Something went wrong",
        });
        return;
      }
    });
  } else {
    res.json({
      success: false,
      message: "Id and Image needed",
    });
  }
};

const getUserLatestResult = async (req, res) => {
  const { userId } = req.body;
  const userData = await User.findOne({ _id: userId }, "-password");
  const latestResultId = userData.latestResult;

  let foundQuizResult = await Quizresult.findOne({ _id: latestResultId });
  if (foundQuizResult) {
    res.json({
      success: true,
      message: " Result Found",
      result: foundQuizResult,
    });
    return;
  }

  foundQuizResult = await Weekquizresult.findOne({ _id: latestResultId });
  if (foundQuizResult) {
    res.json({
      success: true,
      message: "Latest Result Found",
      result: foundQuizResult,
    });
    return;
  }

  foundQuizResult = await Monthquizresult.findOne({ _id: latestResultId });
  if (foundQuizResult) {
    res.json({
      success: true,
      message: "Latest Result Found",
      result: foundQuizResult,
    });
    return;
  } else {
    res.json({ success: false, message: "No Result found for that user" });
    return;
  }
};

module.exports = {
  signup,
  login,
  emailVerify,
  requestNewEmailOtp,
  newPassword,
  getUsers,
  deleteUsers,
  editBio,
  editUserInfo,
  updateUserImage,
  getUserLatestResult,
};
