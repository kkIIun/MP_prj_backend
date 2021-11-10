const express = require("express");
const Group = require("../schemas/group");
const Profile = require("../schemas/profile");
const Comment = require("../schemas/comment");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");
const router = express.Router();

router
  .route("/")
  .get(isAuthToken, async (req, res) => {
    try {
      const comments = await Comment.find()
        .where("groupId")
        .equals(req.query.groupId)
        .sort("-date");
      res.json({
        code: 200,
        payloads: comments,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    }
  })
  .post(isAuthToken, async (req, res) => {
    try {
      const { comment, groupId, commenter } = req.query;
      const comments = await Comment.create({
        comment: comment,
        groupId: groupId,
        commenter: commenter,
      });
      res.json({
        code: 200,
        payloads: comments,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: error._message,
      });
    }
  });

router
  .route("/:id")
  .put(isAuthToken, async (req, res) => {
    try {
      await Comment.updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          comment: req.query.comment,
        }
      );
      res.json({
        code: 200,
        message: "comment 수정 성공",
      });
    } catch (error) {
      await Comment.updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {}
      );
    }
  })
  .delete(isAuthToken, (req, res) => {
    Comment.deleteOne({
      _id: ObjectId(req.params.id),
    })
      .then(() => {
        res.json({
          code: 200,
          message: "comment 삭제 성공",
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
