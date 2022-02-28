const express = require("express");

const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
const requestRouter = require("./router/requestRouter");
const authRouter = require("./router/authRouter");
const searchRouter = require("./router/authRouter");
const commentRouter = require("./router/commentRouter");
const cors = require("cors");
const app = express();
app.use(cors());

let names = [];

//added for google oauth
const cookie = require("cookie-session");
const passport = require("passport");

// clever cloud mysql db
const connection = require("./model/db");

app.use(express.json());
app.use(express.static("public"));


//added for Oauth and cookies creation

// app.use(
//   cookie({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: ["key1"],
//   })
// );
// // app.use(session({ secret: 'anything' }));
// app.use(passport.initialize());
// app.use(passport.session());

//end - added for auth and cookies creation

// Authentication Router Api written at that file
app.use("/auth", authRouter);

//Users => get all users , get a user , create a user ,  update a user , delete a user
app.use("/api/user", userRouter);

//POSTS -> get all posts , get a post , create a post , update a post , delete a post
app.use("/api/post", postRouter);

// REQUESTS ->
app.use("/api/request", requestRouter);

//commments ->
app.use("/api/comment", commentRouter);

app.get("/showtables", function (req, res) {
  let sql = "show tables";
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        messgae: "cannot show tables",
        error,
      });
    }
    names = [];
    for (const table of data) {
      names.push(table.Tables_in_bvnx2vmltsm2tfjtyw21);
    }
    res.json({
      message: "showing all tables",
      names,
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`app is listeningg at ${port} port !!`);
});
