const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

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
  // if (!email || !password) {
  //   res.status(400).json({ error: "invalid email and password" });
  // }

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ user: user._id });
    } else {
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "User does not exist", error: error.message });
  }
});

// };

//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //check for duplicate
  if (err.code === 11000) {
    errors.email = "Email already registered";
    return errors;
  }
  //validate errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//Token will last 2 days
const maxAge = 2 * 24 * 60 * 60;
//create JSON Web Token
const createToken = (id) => {
  return jwt.sign({ id }, "secret_key", { expiresIn: maxAge });
};

//sign up new user
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  //check length of password
  // if (password.length < 6) {
  //   res.status(400).json({
  //     message: "Please enter a valid email or minimum of 6 characters password",
  //   });
  // }
  try {
    const user = await User.create({
      email,
      password,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
    console.log(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json({ errors });
    // res
    //   .status(401)
    //   .json({ message: "User not successful created", error: error.message });
  }
});

router.get("/load", (req, res) => {
  res.render("load");
});

//logout route
router.delete("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to logout");
      } else {
        res.send("Logout successful");
      }
    });
  } else {
    res.send("Logout");
  }
});
//JSON web token
// function generateToken(user) {
//   return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
// }

module.exports = router;
