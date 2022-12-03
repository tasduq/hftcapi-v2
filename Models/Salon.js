const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const salonSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  imagesId: {
    type: Schema.Types.ObjectId,
    ref: "Images",
  },
  location: { type: Object, required: true },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Salon", salonSchema);
