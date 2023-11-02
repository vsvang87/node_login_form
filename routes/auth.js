const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/Users");
const verifyJWT = require("../middleware/verifyJWT");
const emailValidator = require("email-validator");
const LocalStrategy = require("passport-local");

router.get("/", (req, res) => {
  res.render("index");
});

//login routes
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //checking if email or password is provided
  if (!email || !password) {
    res.status(400).json({ error: "invalid email and password" });
  }

  //find user
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      res.status(401).json({
        message: "Incorrect email or password",
        error: "User not found",
      });
    } else {
      console.log("Login Successful!");
      return res.redirect("load");
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "User does not exist", error: error.message });
  }
});

// };
//verify JWT
router.get("/jwt-test", verifyJWT.verify, (req, res) => {
  res.status(200).json(req.user);
});

//sign up new user
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  //validate email
  if (emailValidator.validate(!email)) {
    res.status(400).json({ message: "Invalid email" });
  }

  //check length of password
  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password needs to be 6 or more characters" });
  }

  try {
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password,
    });
    console.log(user);
    return res.redirect("load");
  } catch (error) {
    res
      .status(401)
      .json({ message: "User not successful created", error: error.message });
  }
});

router.get("/load", (req, res) => {
  res.render("load");
});
//JSON web token
function generateToken(user) {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
}

module.exports = router;
