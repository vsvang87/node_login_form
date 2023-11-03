const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
    load: {
      title: String,
      body: String,
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum length of 6 characters"],
  },
  refreshToken: String,
});

//trigger function before doc saved to Database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); //Generate Salt
  this.password = await bcrypt.hash(this.password, salt); //Hash Password
  next();
});

module.exports = mongoose.model("User", userSchema);
