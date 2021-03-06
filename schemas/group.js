const mongoose = require("mongoose");

const { Schema } = mongoose;
const ObjectId = require("mongoose").Types.ObjectId;

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  users: [{ type: String, ref: "Profile" }],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Group", groupSchema);
