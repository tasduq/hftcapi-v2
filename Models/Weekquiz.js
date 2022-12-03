const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const weekQuizSchema = new Schema({
  question: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Weekquiz", weekQuizSchema);
