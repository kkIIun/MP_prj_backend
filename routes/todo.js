const express = require("express");
const Todo = require("../schemas/todo");
const Profile = require("../schemas/profile");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

router.get("/my", (req, res) => {
  Todo.find()
    .where("author")
    .equals(req.query.email)
    .exists("groups", false)
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

router.post("/", (req, res) => {
  const { email, deadline, title, assignedUser } = req.query;
  if (assignedUser && !Profile.find().where("email").equals(assignedUser)) {
    return res.status(500).json({
      code: 500,
      message: "배정할 유저가 존재하지 않습니다.",
    });
  }

  Todo.create({
    author: email,
    deadline: deadline,
    title: title,
    assignedUser: assignedUser,
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

router.put("/:id", async (req, res) => {
  const { deadline, title, assignedUser, check } = req.query;
  const user = await Profile.find({
    email: assignedUser,
  });
  console.log(user.email, assignedUser);
  if (assignedUser !== user.email) {
    return res.status(500).json({
      code: 500,
      message: "배정할 유저가 존재하지 않습니다.",
    });
  }
  Todo.updateOne(
    {
      _id: ObjectId(req.params.id),
    },
    {
      deadline: deadline,
      title: title,
      assignedUser: assignedUser,
      check: check,
    }
  )
    .then(() => {
      res.json({
        code: 200,
        message: "todo 수정 성공",
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

router.delete("/:id", (req, res) => {
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

router.get("/myGroup", (req, res) => {
  Todo.find()
    .where("groupId")
    .equals(req.query.groupId)
    .then((todos) => {
      console.log(todos);
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

module.exports = router;
