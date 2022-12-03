const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const appImagesSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Appimages", appImagesSchema);
