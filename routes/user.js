const express = require("express");
const User = require("../schemas/user");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

router.route("/").get((req, res) => {
  User.find()
    .where("author")
    .equals(ObjectId(req.query.id))
    .exists("group", false)
    .then((user) => {
      if (user)
        res.json({
          code: 200,
          payloads: user,
        });
      else {
        User.create();
      }
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
