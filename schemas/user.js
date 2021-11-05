const mongoose = require("mongoose");

const { Schema } = mongoose;
const ObjectId = require("mongoose").Types.ObjectId;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  group: [{ id: ObjectId, groupName: String }],
  avatar: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
