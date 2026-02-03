const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
  title: String,
  game: String,
  streamer: String,
  videoUrl: String,
  thumbnailUrl: String,  // <--- Add this new field
  isLive: Boolean,
  viewers: Number
});

module.exports = mongoose.model("Stream", StreamSchema);