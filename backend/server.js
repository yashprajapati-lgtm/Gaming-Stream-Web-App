const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// Route Imports
const authRoutes = require("./routes/auth.routes");
const streamRoutes = require("./routes/stream.routes");

const app = express();
const server = http.createServer(app);

// ✅ 1. Definitive CORS Options
// These allow your specific Render frontend and local laptop to connect
const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "https://gaming-stream-frontend.onrender.com" // ✅ Correct Frontend URL from Render
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true
};

// ✅ 2. Apply Middleware in the Correct Order
app.use(cors(corsOptions)); // Must be first
app.use(express.json()); 
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// ✅ 3. Socket.io setup
const io = new Server(server, {
  cors: corsOptions
});

// ✅ 4. Database Connection
const MONGO_URI = "mongodb+srv://yash:StreamApp2026@cluster0.xk7v0h5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to Cloud Database (Atlas)"))
  .catch(err => console.error("❌ DB Error:", err));

// ✅ 5. Routes (Must come AFTER middleware)
app.use("/api/auth", authRoutes);
app.use("/api/stream", streamRoutes);

// ✅ 6. Socket.io Logic
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// ✅ 7. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});