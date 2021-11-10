const express = require("express");
const Group = require("../schemas/group");
const Profile = require("../schemas/profile");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");
const router = express.Router();

router.route("/").post(isAuthToken, async (req, res) => {
  var group = await new Group({
    groupName: req.query.groupName,
  });
  const user = { _id: req.query.id, name: req.query.name };
  if (!req.query.id || !req.query.name) {
    return res.status(500).json({
      code: 500,
      message: "user정보를 입력해주세요.",
    });
  }
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
  .put(isAuthToken, (req, res) => {
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

router.put("/join/:id", isAuthToken, async (req, res) => {
  try {
    const userData = { _id: req.query.id, name: req.query.name };
    const group = await Group.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: { users: userData },
      }
    );
    const groupData = {
      _id: ObjectId(req.params.id),
      groupName: req.query.groupName,
    };
    await Profile.updateOne(
      {
        _id: req.query.id,
      },
      {
        $push: { groups: groupData },
      }
    );
    res.json({
      code: 200,
      message: "group 조인 성공",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error._message,
    });
  }
});

router.put("/remove/:id", isAuthToken, async (req, res) => {
  try {
    const group = await Group.find({
      _id: req.params.id,
    });
    if (!group[0]) {
      return res.status(500).json({
        code: 500,
        message: "해당그룹이 없습니다.",
      });
    }
    group.users.pull({ _id: req.query.id });
    res.json({
      code: 200,
      message: "group user 삭제 성공",
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
