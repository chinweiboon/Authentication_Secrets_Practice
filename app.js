//jshint esversion:6
require("dotenv").config();
const md5 = require("md5");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

//userDB Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  user.save(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  User.findOne({
    email: req.body.username
  }, function (err, loginResult) {
    if(loginResult.password === md5(req.body.password)){
      res.render("secrets");
    }
    else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server Started on port 3000")
});
