const mongoose = require("mongoose");
const Comment = require("./comment");
const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  url =
    "mongodb://" +
    process.env.name +
    ":" +
    process.env.password +
    "@localhost:27017/admin";
  mongoose.connect(
    url,
    {
      dbName: "MP_prj",
    },
    (error) => {
      if (error) {
        console.log("몽고디비 연결 에러", error);
      } else {
        Comment.create({
          commenter: "kijung",
          comment: "backend start",
          group: "1",
        });
        console.log("몽고디비 연결 성공");
      }
    }
  );
  mongoose.connection.on("error", (error) => {
    console.log("몽고디비 연결 에러", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
  });
};

module.exports = connect;
