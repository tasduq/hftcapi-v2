const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const productScoreRecomSchema = new Schema({
  name: { type: String },
  products: { type: Array },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Productscorerecom", productScoreRecomSchema);
