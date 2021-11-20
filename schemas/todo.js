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
  groupId: {
    type: ObjectId,
    required: true,
    ref: "Group",
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
    type: String,
    required: true,
    ref: "Profile",
  },
  assignedUser: {
    type: String,
    default: null,
    ref: "Profile",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
