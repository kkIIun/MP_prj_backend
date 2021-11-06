const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const todoSchema = new Schema({
  deadline: {
    type: Date,
    default: Date.now,
  },
  group: {
    type: { id: ObjectId, groupName: String },
  },
  title: {
    type: String,
    required: true,
  },
  check: {
    type: Boolean,
    default: false,
  },
  author: {
    type: { email: String, name: String },
    required: true,
  },
  assignedUser: { email: String, name: String },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
