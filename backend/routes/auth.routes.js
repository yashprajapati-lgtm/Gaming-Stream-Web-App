const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// --- REGISTER ROUTE ---
// Changed from /signup to /register to match your Frontend code!
// ✅ Correct Route for your Frontend
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, bio } = req.body; // Pull Bio from body

    const user = new User({
      username,
      email: email.trim().toLowerCase(),
      password, // Use bcrypt.hash in production!
      bio: bio || "" // ✅ Save the Bio here
    });

    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const cleanEmail = req.body.email.trim().toLowerCase();
    const cleanPassword = req.body.password.trim();

    // Find user
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    // Check Password (Note: In a real app, use bcrypt here!)
    if (user.password !== cleanPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id }, 
      "SECRET_KEY", // Make sure this matches your middleware!
      { expiresIn: "7d" } // Increased to 7 days so you don't get "Invalid Token" often
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- VIEW ALL USERS (For your testing) ---
router.get("/check-db", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;