const mongoose = require("mongoose");

const { Schema } = mongoose;
const ObjectId = require("mongoose").Types.ObjectId;

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  groups: [{ type: ObjectId, ref: "Group" }],
  avatarSrc: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  _id: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
