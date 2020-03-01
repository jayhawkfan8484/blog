const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    min: 3,
    max: 30
  },
  email: {
    type: String,
    unique: true,
    requred: true,
    max: 50,
    lowercase: true
  },
  password: {
    type: String,
    unique: true,
    required: true,
    min: 6,
    max: 30
  }
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //       required: true
  //     }
  //   }
  // ]
});

// UserSchema.pre("save", async next => {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

// UserSchema.methods.generateAuthToken = async function() {
//   // Generate an auth token for the user
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
//   user.tokens = user.tokens.concat({ token });
//   await user.save();
//   return token;
// };

// UserSchema.statics.findByCredentials = async (username, password) => {
//   // Search for a user by email and password.
//   const user = await User.findOne({ username });
//   if (!user) {
//     throw new Error({ error: "Invalid username credentials" });
//   }
//   const isPasswordMatch = await bcrypt.compare(password, user.password);
//   if (!isPasswordMatch) {
//     throw new Error({ error: "Invalid Password credentials" });
//   }
//   return user;
// };

const User = mongoose.model("User", UserSchema);

module.exports = User;
