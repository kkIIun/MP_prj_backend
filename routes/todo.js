const express = require("express");
const Todo = require("../schemas/todo");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

router.get("/my", (req, res) => {
  Todo.find()
    .where("author")
    .equals(ObjectId(req.query.id))
    .exists("group", false)
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

router.post("/", (req, res) => {
  const { id, deadline, group, title, assignedUser } = req.query;
  Todo.create({
    author: ObjectId(id),
    deadline: deadline,
    group: group,
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

router.put("/:id", (req, res) => {
  const { deadline, title, assignedUser, check } = req.query;
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
    .then((todos) => {
      console.log(todos);
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
  const { deadline, title, assignedUser, check } = req.query;
  Todo.deleteOne({
    _id: ObjectId(req.params.id),
  })
    .then((todos) => {
      console.log(todos);
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
    .where("group")
    .equals(req.query.group)
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
