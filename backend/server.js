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

// ✅ 1. Define CORS Options FIRST
// Using the correct URL from your Render dashboard
const corsOptions = {
  origin: [
    "http://localhost:5173", 
    "https://gaming-stream-frontend.onrender.com" // ✅ Corrected Frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ✅ 2. Apply Middleware in the CORRECT Order
app.use(cors(corsOptions)); // Apply CORS once with specific options
app.use(express.json()); // Allow the server to handle JSON data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve files

// ✅ 3. Initialize Socket.io with the same CORS rules
const io = new Server(server, {
  cors: corsOptions
});

// ✅ 4. Database Connection (MongoDB Atlas)
const MONGO_URI = "mongodb+srv://yash:StreamApp2026@cluster0.xk7v0h5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to Cloud Database (Atlas)"))
  .catch(err => console.error("❌ DB Error:", err));

// ✅ 5. Define API Routes (Must come AFTER middleware)
app.use("/api/auth", authRoutes);
app.use("/api/stream", streamRoutes);

// ✅ 6. Socket.io Logic for Chat
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// ✅ 7. Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});