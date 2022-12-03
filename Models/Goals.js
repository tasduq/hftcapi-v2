const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const goalsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  list: { type: Array },
  result: { type: Number, default: 0 },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Goals", goalsSchema);
