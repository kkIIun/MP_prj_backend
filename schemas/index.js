const mongoose = require("mongoose");
const Comment = require("./comment");
const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  uri =
    "mongodb+srv://rlwjd4177:somuch0503@cluster0.1mhao.mongodb.net/MP_prj?retryWrites=true&w=majority";

  // uri =
  //   "mongodb://" +
  //   process.env.name +
  //   ":" +
  //   process.env.password +
  //   "@localhost:27017/admin";
  mongoose.connect(
    uri,
    {
      dbName: "MP_prj",
    },
    (error) => {
      if (error) {
        console.log("몽고디비 연결 에러", error);
      } else {
        console.log("몽고디비 연결 성공");
      }
    }
  );

  // const { MongoClient } = require("mongodb");
  // const uri =
  //   "mongodb+srv://rlwjd4177:somuch0503@cluster0.1mhao.mongodb.net/MP_prj?retryWrites=true&w=majority";
  // const client = new MongoClient(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  // client.connect((err) => {
  //   const collection = client.db("test").collection("devices");
  //   // perform actions on the collection object
  //   client.close();
  // });

  mongoose.connection.on("error", (error) => {
    console.log("몽고디비 연결 에러", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
    connect();
  });
};

module.exports = connect;
