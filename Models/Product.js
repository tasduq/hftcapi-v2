const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  ingredients: { type: String },
  coverImage: { type: String, required: true },
  imagesId: {
    type: Schema.Types.ObjectId,
    ref: "Images",
  },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Product", productSchema);
