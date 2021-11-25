const mongoose = require("mongoose");

const { Schema } = mongoose;
const ObjectId = require("mongoose").Types.ObjectId;

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  groupId: {
    type: ObjectId,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
