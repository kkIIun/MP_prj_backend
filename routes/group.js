const express = require("express");
const Group = require("../schemas/group");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

router.post("/", (req, res) => {
  var group = new Group({
    groupName: req.query.groupName,
  });
  const user = { email: req.query.email, name: req.query.name };
  group.users.push(user);
  group
    .save()
    .then((group) => {
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
    const user = { email: req.query.email, name: req.query.name };
    var group = Group.find().where(_id).equals(ObjectId(req.params.id));
    if (req.query.groupName) group.groupName = req.query.groupName;
    if (req.query.email) group.users.push(user);
    group
      .save()
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
