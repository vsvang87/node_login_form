const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/Users");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

//login routes
router.get("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "no user found with that email" });
      } else {
        bcrypt.compare(req.body.password, user.password, (error, match) => {
          if (error) {
            res.status(500).json(error);
          } else if (match) {
            res.status(200).json({ token: generateToken(user) });
          } else {
            res.status(403).json({ error: "password does not match" });
          }
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });

  res.render("login.ejs");
});
router.post("/login", (req, res) => {});
//register routes
// const handleNewUser = (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.status(400).json({ message: "Email and Password are required" });
//   }
//   //checking for duplicates
//   const duplicates = usersDB.users.find((person) => person.email === email);
//   if (duplicates) {
//     res.sendStatus(409);
//   }
// };
//verify JWT
router.get("/jwt-test", verifyJWT.verify, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});
router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) {
      res.status(500).json(error);
    } else {
      const newUser = User.create({
        email: req.body.email,
        password: hash,
      });
      newUser
        .save()
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });
});

//JSON web token
function generateToken(user) {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
}

module.exports = router;
