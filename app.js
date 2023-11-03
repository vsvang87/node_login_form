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
