const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: { type: String },
  options: { type: Array },
  tips: { type: String },
  firstQuestion: { type: Boolean },
  lastQuestion: { type: Boolean },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Quiz", quizSchema);
