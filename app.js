const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connect = require("./schemas");
const { swaggerUi, specs } = require("./modules/swagger");

const todoRouter = require("./routes/todo");
const profileRouter = require("./routes/profile");
const groupRouter = require("./routes/group");
const commentRouter = require("./routes/comment");
const projectRouter = require("./routes/project");

dotenv.config({ path: path.resolve(__dirname, "./.env") });
const app = express();
app.set("port", process.env.PORT || 3000);
connect();

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/todo", todoRouter);
app.use("/profile", profileRouter);
app.use("/group", groupRouter);
app.use("/comment", commentRouter);
app.use("/project", projectRouter);
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
