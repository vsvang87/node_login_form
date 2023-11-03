const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const connectDB = require("./config/dbCon");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(authRoute);

app.set("view engine", "ejs");

//connect to DB
connectDB();

//app running on server
app.listen(3000, (req, res) => {
  console.log("App running on port 3000");
});

//cookies
// app.get("/set-cookies", (req, res) => {
//   res.cookie("newUser", false);
//   res.cookie("isUser", true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
//   res.send("cookies successful");
// });
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });
