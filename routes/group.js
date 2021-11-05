const express = require("express");
const Group = require("../schemas/group");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

router.post("/", (req, res) => {
  Group.create({
    groupName: req.query.groupName,
  })
    .then((group) => {
      const user = { id: req.query.id, name: req.query.name };
      group.users.push(user);
      res.json({
        code: 200,
        payloads: group,
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

router
  .route("/:id")
  .put((req, res) => {
    const user = { id: req.query.id, name: req.query.name };
    Group.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        groupName: req.query.groupName,
        $push: { users: user },
      }
    )
      .then(() => {
        res.json({
          code: 200,
          message: "group 수정 성공",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          code: 500,
          message: error._message,
        });
      });
  })
  .delete((req, res) => {
    Group.deleteOne({
      _id: ObjectId(req.params.id),
    })
      .then(() => {
        res.json({
          code: 200,
          message: "group 삭제 성공",
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
