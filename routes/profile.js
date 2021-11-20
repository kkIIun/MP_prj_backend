const express = require("express");
const Profile = require("../schemas/profile");
const Group = require("../schemas/group");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");
const router = express.Router();

/**
 * @swagger
 *  /profile:
 *    get:
 *      tags:
 *      - profile
 *      description: 프로필을 가져옵니다(없으면 생성합니다).
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: name
 *        in: query
 *        description: "유저 이름"
 *        required: true
 *        type: string
 *      - name: id
 *        in: query
 *        description: "유저 id"
 *        required: true
 *        type: string
 *      - name: email
 *        in: query
 *        description: "유저 email"
 *        required: true
 *        type: string
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: 유저 프로필 가져옴
 *        schema:
 *          type: array
 *          items:
 *           $ref: '#/definitions/schemas/Profile'
 */

/**
 * @swagger
 *  /profile/{id}:
 *    put:
 *      tags:
 *      - profile
 *      description: 프로필을 수정합니다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *        description: 유저 id
 *      - name: avatar
 *        in: query
 *        description: "프로필 이미지 res"
 *        required: true
 *        type: string
 *      security:
 *      - Authorization: []
 *      responses:
 *       200:
 *        description: 유저 프로필 수정
 */
router.route("/").get(isAuthToken, (req, res) => {
  const { email, name, id } = req.query;
  Profile.find()
    .where("_id")
    .equals(id)
    .populate("groups", "groupName")
    .then(async (user) => {
      if (!user.length) {
        var user = await Profile.create({
          _id: id,
          email: email,
          name: name,
        });
        var group = await Group.create({
          groupName: "개인",
        });
        console.log(user, group);
        group.users.push({ _id: id });
        user.groups.push({ _id: group._id });
        group.save();
        user.save();
        await user.populate("groups", "groupName");
      }
      res.json({
        code: 200,
        payloads: user,
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

router.route("/:id").put(isAuthToken, (req, res) => {
  const { avatar } = req.query;
  Profile.updateOne(
    {
      _id: req.params.id,
    },
    {
      avatarSrc: avatar,
    }
  )
    .then((user) => {
      res.json({
        code: 200,
        payloads: user,
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
