const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // New Import
const { Server } = require("socket.io"); // New Import
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const streamRoutes = require("./routes/stream.routes");

const app = express();
const server = http.createServer(app); // Wrap Express in HTTP Server

const io = new Server(server, {
  cors: {
    // Make sure your NETLIFY or RENDER frontend link is in this list
    origin: ["http://localhost:5173", "https://gaming-stream-hub.onrender.com"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// --- Updated CORS Middleware ---
const corsOptions = {
  // Use the same list you have for Socket.io
  origin: ["http://localhost:5173", "https://gaming-stream-hub.onrender.com"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions)); // ✅ Apply the strict options here

// Database Connection
// Password is now 'StreamApp2026' (No symbol)
const MONGO_URI = "mongodb+srv://yash:StreamApp2026@cluster0.xk7v0h5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to Cloud Database (Atlas)"))
  .catch(err => console.error("❌ DB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stream", streamRoutes);

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User joins a specific stream's chat room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // User sends a message
  socket.on("send_message", (data) => {
    // Send this message to everyone ELSE in the same room
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Use the Cloud's port OR 5000 if on laptop
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});