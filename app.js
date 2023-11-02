const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/Users");

//DB url
const uri =
  "mongodb+srv://vvang:visayvang2468@cluster0.j6lub2l.mongodb.net/test?retryWrites=true&w=majority";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//connect to DB
const connectToDb = async () => {
  try {
    const connect = await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Successfully connected to Database!");
  } catch (error) {
    console.log(error);
  }
};
connectToDb();

//app running on server
app.listen(3000, (req, res) => {
  console.log("App running on port 3000");
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//login routes
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

//register routes
const handleNewUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
  }
  //checking for duplicates
  const duplicates = usersDB.users.find((person) => person.email === email);
  if (duplicates) {
    res.sendStatus(409);
  }

  // try {
  //   const hashedPassword = await bcrypt.hash(password);
  //   //store new user
  //   const newUser = {
  //     "email": email,
  //     "password": hashedPassword,
  //   }
  // } catch (error) {

  // }
};
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
