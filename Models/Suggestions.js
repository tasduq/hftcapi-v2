const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const suggestionsSchema = new Schema({
  name: { type: String },
  suggestions: { type: Array },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Suggestions", suggestionsSchema);
