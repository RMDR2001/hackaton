const mongoose = require("mongoose");

const userSkills = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    phone: { type: String, require: true },
    fullname: { type: String, require: true },
    skills: [userSkills],
  },
  { collection: "user_skills" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
