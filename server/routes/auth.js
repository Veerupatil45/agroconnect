const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Route
router.post("/login", async (req, res) => {
  const { email, password, isOfficerLogin } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    // 👇 Check if officer trying to login but user is not an officer
    if (isOfficerLogin && !user.isOfficer) {
      return res.status(403).json({ msg: "Not authorized as an officer" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        isOfficer: user.isOfficer,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


//Register Route
// Register Route
router.post("/register", async (req, res) => {
  const { name, email, phone, password, location, isOfficer } = req.body; // 🔹 Destructure isOfficer

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      location,
      password: hashedPassword,
      isOfficer: !!isOfficer, // 🔹 Ensure it's a boolean
    });

    await newUser.save();
    res.status(201).json({ msg: "User Registered Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ exists: false, msg: "Email not registered" });

    res.status(200).json({ exists: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
