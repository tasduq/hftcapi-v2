const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const productRecomSchema = new Schema({
  productsIds: { type: Array },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Productrecom", productRecomSchema);
