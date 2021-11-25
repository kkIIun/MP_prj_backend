const express = require("express");
const Todo = require("../schemas/todo");
const Profile = require("../schemas/profile");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");

const router = express.Router();

router.get("/", isAuthToken, (req, res) => {
  Todo.find()
    .where("projectId")
    .equals(OjbectId(req.query.projectId))
    .then((todos) => {
      res.json({
        code: 200,
        payloads: todos,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    });
});

router.post("/", isAuthToken, async (req, res) => {
  const { userId, beginDate, endDate, title, projectId, color } = req.query;

  Todo.create({
    author: userId,
    endDate: endDate,
    beginDate: beginDate,
    color: color,
    title: title,
    projectId: projectId,
  })
    .then((todos) => {
      console.log(todos);
      res.json({
        code: 200,
        message: "todo 저장 성공",
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    });
});

router.put("/:id", isAuthToken, async (req, res) => {
  try {
    const { deadline, title, assignedUser } = req.query;
    var check;
    if (req.query.check == "true") check = true;
    if (req.query.check == "false") check = false;

    const user = await Profile.find({
      _id: assignedUser,
    });
    console.log(user);
    if (assignedUser && !user[0]) {
      return res.status(500).json({
        code: 500,
        message: "배정할 유저가 존재하지 않습니다.",
      });
    }
    await Todo.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        deadline: deadline,
        title: title,
        assignedUser: assignedUser,
        check: check,
      }
    );
    res.json({
      code: 200,
      message: "todo 수정 성공",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error._message,
    });
  }
});

router.delete("/:id", isAuthToken, (req, res) => {
  Todo.deleteOne({
    _id: ObjectId(req.params.id),
  })
    .then(() => {
      res.json({
        code: 200,
        message: "todo 삭제 성공",
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    });
});
module.exports = router;
