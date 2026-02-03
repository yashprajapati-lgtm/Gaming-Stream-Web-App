const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure this matches your file name!

const router = express.Router(); // <--- THIS WAS MISSING

// --- SIGNUP ROUTE ---
router.post("/signup", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password.trim()
    });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// --- LOGIN ROUTE (Debug Version) ---
router.post("/login", async (req, res) => {
  try {
    const cleanEmail = req.body.email.trim().toLowerCase();
    const cleanPassword = req.body.password.trim();

    console.log("--- LOGIN DEBUG ---");
    console.log(`Email: '${cleanEmail}'`);
    
    // Find user
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log("❌ Email not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check Password
    if (user.password !== cleanPassword) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login Success");

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- CHEAT SHEET (View All Users) ---
router.get("/check-db", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;