const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import fs for deleting files
const Stream = require("../models/Stream"); // Ensure correct path
const auth = require("../middleware/auth.middleware");

const router = express.Router();

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Rename file to avoid duplicates
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 2. Configure Upload for 2 Files (Video + Thumbnail)
const uploadFields = upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]);

// 3. Create Stream Route (Updated for Thumbnails)
router.post("/create", auth, uploadFields, async (req, res) => {
  try {
    // Check if files exist
    const videoUrl = req.files['videoFile'] ? `/uploads/${req.files['videoFile'][0].filename}` : "";
    const thumbnailUrl = req.files['thumbnailFile'] ? `/uploads/${req.files['thumbnailFile'][0].filename}` : "";

    const stream = new Stream({
      title: req.body.title,
      game: req.body.game,
      streamer: req.user.id,
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl, // <--- Saving the thumbnail
      isLive: true,
      viewers: 0
    });

    await stream.save();
    res.json({ message: "Stream created successfully", stream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating stream" });
  }
});

// 4. Get Live Streams
router.get("/live", async (req, res) => {
  const streams = await Stream.find({ isLive: true });
  res.json(streams);
});

// 5. Delete Stream Route
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }

    // Delete Video File
    if (stream.videoUrl) {
      const videoPath = path.join(__dirname, "../", stream.videoUrl);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    // Delete Thumbnail File (Optional: Clean up image too)
    if (stream.thumbnailUrl) {
      const thumbPath = path.join(__dirname, "../", stream.thumbnailUrl);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    await Stream.findByIdAndDelete(req.params.id);
    res.json({ message: "Stream deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting stream" });
  }
});
// GET SINGLE STREAM (New Route)
router.get("/:id", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stream" });
  }
});


module.exports = router;