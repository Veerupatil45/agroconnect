const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ // simple pattern for Indian phone numbers
    },
  password: String,
  role: { type: String, enum: ["farmer", "admin"], default: "farmer" },
  location: String,
  profileImage: { type: String, default: "" },
  isOfficer: { type: Boolean, default: false }, 
  
});

module.exports = mongoose.model("User", userSchema);

