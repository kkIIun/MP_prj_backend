const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connect = require("./schemas");

dotenv.config();
const app = express();
app.set("port", process.env.PORT || 3002);
connect();
app.use(() => {
  //   Comment.create({
  //     commenter: "kijung",
  //     comment: "backend start",
  //     group: "1",
  //   });
  console.log("1231312");
});
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
