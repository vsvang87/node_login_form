const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check if json web token exist and is verified
  if (token) {
    jwt.verify(token, "secret_key", (err, decodedToken) => {
      //check if token is valid, if not then redirect to login page
      if (err) {
        console.log(err.message);
        res.redirect("/");
      } else {
        // console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/");
  }
};

module.exports = { requireAuth };
