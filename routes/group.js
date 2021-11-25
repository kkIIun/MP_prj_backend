const express = require("express");
const Group = require("../schemas/group");
const Profile = require("../schemas/profile");
const Project = require("../schemas/project");
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
 *      - name: userId
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
    if (!req.query.userId) {
      return res.status(500).json({
        code: 500,
        message: "user정보를 입력해주세요.",
      });
    }
    console.log(req.query.groupName);
    if (
      req.query.groupName === "" ||
      req.query.groupName === " " ||
      req.query.groupName === "  "
    ) {
      return res.json({
        code: 500,
        message: "잘못된 groupName입니다.",
      });
    }
    var user = await Profile.find().where("_id").equals(req.query.userId);
    if (!user[0]) {
      return res.json({
        code: 500,
        message: "해당 user 정보가 없습니다.",
      });
    }
    var group = await Group.find({
      groupName: req.query.groupName,
    });
    console.log(group, group.length);
    if (group.length)
      return res.json({
        code: 500,
        message: "중복된 groupName입니다.",
      });
    var group = await new Group({
      groupName: req.query.groupName,
    });
    await Project.create({
      groupId: group.id,
      projectName: "Todo",
    });
    group.users.push({ _id: req.query.userId });
    user[0].groups.push({ _id: group._id });
    group.save();
    user[0].save();
    res.json({
      code: 200,
      message: "그룹을 생성하였습니다.",
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
 *      description: 그룹을 삭제합니다.
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

/**
 * @swagger
 *  /group/{id}:
 *    get:
 *      tags:
 *      - group
 *      description: 그룹의 정보를 가져옵니다.
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
 *        description: 그룹 가져오기
 *        schema:
 *          type: array
 *          items:
 *           $ref: '#/definitions/schemas/Group'
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
  })
  .get(isAuthToken, async (req, res) => {
    try {
      const group = await Group.findOne({ _id: req.params.id }).populate(
        "users",
        "name"
      );
      console.log(group);
      res.json({
        code: 200,
        payloads: group,
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

    if (group[0].users.indexOf(user[0]._id) !== -1) {
      return res.json({
        code: 500,
        message: "이미 group에 참여중입니다.",
      });
    }
    group[0].users.push({ _id: user[0]._id });
    user[0].groups.push({ _id: group[0]._id });
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
    user[0].groups.pull({ _id: group[0]._id });
    group[0].save();
    user[0].save();
    if (!group[0].users.length)
      await Group.deleteOne({
        _id: group[0]._id,
      });
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
