const express = require("express");
const Profile = require("../schemas/profile");
const ObjectId = require("mongoose").Types.ObjectId;
const { isAuthToken } = require("./auth");
const router = express.Router();

router
  .route("/")
  .get(isAuthToken, (req, res) => {
    const { email, name, id } = req.query;
    Profile.find()
      .where("_id")
      .equals(id)
      .then(async (user) => {
        if (!user.length) {
          user = await Profile.create({
            _id: id,
            email: email,
            name: name,
          });
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
  })
  .put(isAuthToken, (req, res) => {
    const { id, avatar } = req.query;
    Profile.updateOne(
      {
        id: id,
      },
      {
        avatarSrc: avatar,
      }
    )
      .then(() => {
        res.json({
          code: 200,
          message: "프로필 수정 성공",
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
