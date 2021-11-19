const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  groupId: {
    type: ObjectId,
    required: true,
    ref: "Group",
  },
  commenter: {
    type: String,
    required: true,
    ref: "Profile",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
