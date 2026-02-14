const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Stream = require("../models/Stream");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// --- 1. CONFIG: Multer Storage (For Uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads directory exists
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]);

// --- 2. ROUTES ---

// ✅ GET ALL STREAMS (This is the MISSING ROUTE that fixes your error!)
router.get("/", async (req, res) => {
  try {
    const streams = await Stream.find(); // Fetch ALL streams (Live & Offline)
    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching streams" });
  }
});

// ✅ GET LIVE STREAMS ONLY (For Home Page)
router.get("/live", async (req, res) => {
  try {
    const streams = await Stream.find({ isLive: true });
    res.json(streams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching live streams" });
  }
});

// ✅ GET SINGLE STREAM (For Video Page)
router.get("/:id", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stream" });
  }
});

// ✅ CREATE STREAM (With Video & Thumbnail)
router.post("/create", auth, uploadFields, async (req, res) => {
  try {
    const videoUrl = req.files['videoFile'] ? `/uploads/${req.files['videoFile'][0].filename}` : "";
    const thumbnailUrl = req.files['thumbnailFile'] ? `/uploads/${req.files['thumbnailFile'][0].filename}` : "";

    const stream = new Stream({
      title: req.body.title,
      game: req.body.game || "Unknown Game",
      description: req.body.description || "",
      streamer: req.user.id, // Comes from auth middleware
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl,
      isLive: true,
      viewers: 0
    });

    await stream.save();
    res.status(201).json({ message: "Stream created successfully", stream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating stream" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: "Stream not found" });

    // Optional: Delete the actual files to save space
    if (stream.videoUrl) {
       // Fix path to go up one level to root
       const filePath = path.join(__dirname, "..", stream.videoUrl);
       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Stream.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Stream deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete stream" });
  }
});

module.exports = router;