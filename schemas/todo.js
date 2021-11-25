const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const todoSchema = new Schema({
  endDate: {
    type: Date,
    default: Date.now,
  },
  projectId: {
    type: ObjectId,
    required: true,
    ref: "Project",
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
  color: {
    type: String,
    required: true,
  },
  beginDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
