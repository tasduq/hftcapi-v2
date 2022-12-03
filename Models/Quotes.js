const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const quotesSchema = new Schema({
  quote: { type: String, required: true },
  number: { type: Number, required: true },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Quotes", quotesSchema);
