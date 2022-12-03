const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const weekQuizResultSchema = new Schema({
  result: { type: Number, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  answers: { type: Array },
  created: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Weekquizresult", weekQuizResultSchema);
