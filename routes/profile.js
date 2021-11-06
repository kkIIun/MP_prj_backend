const express = require("express");
const Profile = require("../schemas/profile");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    const { email, name } = req.query;
    Profile.find()
      .where("email")
      .equals(email)
      .then(async (user) => {
        if (!user.length) {
          user = await Profile.create({
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
  .put((req, res) => {
    const { email, avatar } = req.query;
    Profile.updateOne(
      {
        email: email,
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
