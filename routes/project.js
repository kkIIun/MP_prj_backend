const express = require("express");
const Project = require("../schemas/project");
const Todo = require("../schemas/todo");
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
      const projects = await Project.find({
        groupId: ObjectId(groupId),
      }).select("_id projectName");
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
router
  .route("/:id")
  .put(isAuthToken, async (req, res) => {
    try {
      const { projectName } = req.query;
      await Project.updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          projectName: projectName,
        }
      );
      res.json({
        code: 200,
        message: "project 수정 성공",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    }
  })
  .delete(isAuthToken, async (req, res) => {
    try {
      await Project.deleteOne({
        _id: ObjectId(req.params.id),
      });
      await Todo.deleteMany({
        projectId: ObjectId(req.params.id),
      });
      res.json({
        code: 200,
        message: "project 삭제 성공",
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    }
  });

router.get("/todos", isAuthToken, async (req, res) => {
  try {
    const { groupId } = req.query;
    const projects = await Project.find({ groupId: groupId }).populate("todos");
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
