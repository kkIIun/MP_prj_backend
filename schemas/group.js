const mongoose = require("mongoose");

const { Schema } = mongoose;
const groupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", groupSchema);
