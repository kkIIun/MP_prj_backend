const mongoose = require("mongoose");

const { Schema } = mongoose;
const ObjectId = require("mongoose").Types.ObjectId;

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  group: [{ id: ObjectId, groupName: String }],
  avatarSrc: {
    type: String,
    default: "null",
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
});

module.exports = mongoose.model("Profile", profileSchema);
