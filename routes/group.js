const express = require("express");
const Group = require("../schemas/group");
const Profile = require("../schemas/profile");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");
const router = express.Router();

/**
 * @swagger
 *  /group:
 *    post:
 *      tags:
 *      - group
 *      description: 그룹을 생성합니다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: groupName
 *        in: query
 *        description: "그룹 이름"
 *        required: true
 *        type: string
 *      - name: id
 *        in: query
 *        description: "유저 id"
 *        required: true
 *        type: string
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: 그룹 생성 성공
 */
router.route("/").post(isAuthToken, async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(500).json({
        code: 500,
        message: "user정보를 입력해주세요.",
      });
    }

    var group = await new Group({
      groupName: req.query.groupName,
    });
    group.users.push({ _id: req.query.userId });
    group.save();
    res.json({
      code: 200,
      message: "그룹 생성 성공",
    });
  } catch (err) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: error._message,
    });
  }
});

/**
 * @swagger
 *  /group/{id}:
 *    put:
 *      tags:
 *      - group
 *      description: 그룹을 수정합니다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *        description: 그룹 id
 *      - name: groupName
 *        in: query
 *        description: "그룹 이름"
 *        required: true
 *        type: string
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: 그룹 수정 성공
 */

/**
 * @swagger
 *  /group/{id}:
 *    delete:
 *      tags:
 *      - group
 *      description: 그룹을 수정합니다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *        description: 그룹 id
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: 그룹 삭제 성공
 */
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

/**
 * @swagger
 *  /group/join/{id}:
 *    put:
 *      tags:
 *      - group
 *      description: 그룹에 조인합니다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *        description: 그룹 id
 *      - name: userId
 *        in: query
 *        description: "유저 id"
 *        required: true
 *        type: string
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: group 조인 성공
 */
router.put("/join/:id", isAuthToken, async (req, res) => {
  try {
    var user = await Profile.find().where("_id").equals(req.query.userId);
    var group = await Group.find().where("_id").equals(req.params.id);

    if (!user[0]) {
      return res.json({
        code: 500,
        message: "해당 user 정보가 없습니다.",
      });
    }

    if (!group[0]) {
      return res.json({
        code: 500,
        message: "해당 group 정보가 없습니다.",
      });
    }
    group[0].users.push({ _id: user[0]._id });
    user[0].groups.push({ _id: ObjectId(group._id) });
    group[0].save();
    user[0].save();
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

/**
 * @swagger
 *  /group/remove/{id}:
 *    put:
 *      tags:
 *      - group
 *      description: 그룹에 조인합니다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *        description: 그룹 id
 *      - name: userId
 *        in: query
 *        description: "유저 id"
 *        required: true
 *        type: string
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: group 조인 성공
 */
router.put("/remove/:id", isAuthToken, async (req, res) => {
  try {
    var user = await Profile.find().where("_id").equals(req.query.userId);
    var group = await Group.find().where("_id").equals(req.params.id);

    if (!user[0]) {
      return res.json({
        code: 500,
        message: "해당 user 정보가 없습니다.",
      });
    }

    if (!group[0]) {
      return res.json({
        code: 500,
        message: "해당 group 정보가 없습니다.",
      });
    }
    // if (group.users[0]._id !== req.query.userId) {
    //   return res.status(500).json({
    //     code: 500,
    //     message: "그룹장이 아닙니다",
    //   });
    // }
    group[0].users.pull({ _id: user[0]._id });
    user[0].groups.pull({
      _id: ObjectId(group[0]._id),
    });
    group[0].save();
    user[0].save();
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
