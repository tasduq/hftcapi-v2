const mongoose = require("mongoose");

const { Schema } = mongoose;

const imagesSchema = new Schema({
  images: {
    type: Array,
  },
});

module.exports = mongoose.model("Images", imagesSchema);
