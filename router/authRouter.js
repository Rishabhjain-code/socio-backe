const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

/* 
let passport = require("passport");
let GoogleStrategy = require("passport-google-oauth2").Strategy;
let { CLIENT_ID, CLIENT_PW } = require("../config/secrets");
let connection = require("../model/db");
let {checkAuth, googleAuth, callbackAuth} = require("../controller/authController");


passport.serializeUser( function(user , done){
    console.log("inside serailize user !!");
    console.log(user);
    // console.log(done);
    done(null , user);
});

// already cookie was present
passport.deserializeUser( function(data , done){
    console.log("Inside deserialize");
    console.log(data);
    // console.log(done);
    done(null , data);
});

passport.use(
    new GoogleStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_PW,
        callbackURL: "http://localhost:3000/auth/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
          console.log("ACCESSTOKEN" , accessToken);
          console.log("profile" , profile);
          let { email , id , displayName , given_name } = profile;
          let sql = `SELECT * FROM user_table WHERE email = '${email}'`;
          // profile => first time user // already signed up
          connection.query(sql , function(error , data){
              if(error){
                  done(error);
              }
              if(data.length){
                  // user pehle se signed up hain
                  console.log(data);
                  console.log("user already signed up !!");
                  // done
                  done( null , data[0] );
              }
              else{
                  // createUser
                  let sql = `INSERT INTO user_table(uid , name , email , username ) VALUES('${id}' , '${displayName}' , '${email}' , '${given_name}')`;
                  connection.query(sql , function(err , data){
                      if(err){
                          done(err);
                      }else{
                          console.log("User created !!!");
                          // console.log(data);
                          //
                          let sql = `SELECT * FROM user_table WHERE email = '${email}'`;
                          connection.query(sql , function(error , data){
                              if(error){
                                  done(error);
                              }
                              else{
                                  done(null , data[0]);
                              }
                          })
                      }
                  })
              }
          })
          
          
      }
    )
  );

authRouter.route("/checkAuth").get(checkAuth);
authRouter.route("/google").get(passport.authenticate('google' , {scope:['email' , 'profile']}) , googleAuth );
authRouter.route("/callback").get(passport.authenticate('google') , callbackAuth );
 */

//above part for using req.body

const authRouter = require("express").Router();
let connection = require("../model/db");

app.use(express.json());
app.use(express.static("public"));

authRouter.route("/verify/:email/:password").get(function (req, res) {
  // console.log(req.params);
  let { email, password } = req.params;
  // let sql = `SELECT * FROM login_table where email="${email}" AND password = "${password}"`;
  let sql = `SELECT * FROM user_table where email="${email}" AND password = "${password}"`;
  connection.query(sql, function (error, data) {
    if (error) {
      res.json({
        message: "Cannot check now!!!",
        error: error,
      });
    } else {
      res.json({
        message: "check Successfull!!!",
        data: data[0],
      });
    }
  });
});

// by react app
authRouter.route("/setState").get(function (req, res) {
  console.log(req.user);
  if (req.user) {
    res.json({
      loggedIn: true,
      uid: req.user.uid,
    });
  } else {
    res.json({
      loggedIn: false,
      uid: "",
    });
  }
});

authRouter.route("/destroyCookie").get(function (req, res) {
  req.session = null;
  res.json({
    messaged: "LOGGED OUT",
  });
});

module.exports = authRouter;
