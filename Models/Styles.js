const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const styleSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  imagesId: {
    type: Schema.Types.ObjectId,
    ref: "Images",
  },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Style", styleSchema);
