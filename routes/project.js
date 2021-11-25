const express = require("express");
const Project = require("../schemas/project");
const Group = require("../schemas/group");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");
const router = express.Router();

router
  .route("/")
  .post(isAuthToken, async (req, res) => {
    try {
      const { projectName, groupId } = req.query;
      await Project.create({
        projectName: projectName,
        groupId: ObjectId(groupId),
      });
      return res.json({
        code: 200,
        message: "프로젝트 생성 성공",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    }
  })
  .get(isAuthToken, async (req, res) => {
    try {
      const { groupId } = req.query;
      const projects = await Project.find({ groupId: ObjectId(groupId) });
      return res.json({
        code: 200,
        payloads: projects,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    }
  });

module.exports = router;
