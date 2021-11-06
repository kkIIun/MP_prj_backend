const express = require("express");
const Group = require("../schemas/group");
const Profile = require("../schemas/profile");
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
    Group.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        groupName: req.query.groupName,
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

router.put("/join/:id", (req, res) => {
  const userData = { email: req.query.email, name: req.query.name };
  Group.updateOne(
    {
      _id: req.params.id,
    },
    {
      $push: { users: userData },
    }
  )
    .then((group) => {
      const groupData = { id: req.params.id, groupName: group.groupName };
      Profile.updateOne(
        {
          email: req.query.email,
        },
        {
          $push: { groups: groupData },
        }
      )
        .then(() => {
          res.json({
            code: 200,
            message: "그룹 조인 성공",
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
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    });
});
router.module.exports = router;
