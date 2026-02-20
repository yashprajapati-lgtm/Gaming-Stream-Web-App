import React from "react";
import { Link } from "react-router-dom";

function StreamCard({ stream }) {
  // ✅ 1. Point directly to your Render backend to grab the files
  const BACKEND_URL = "https://gaming-stream-web-app.onrender.com";

  // ✅ 2. Format the image URL safely
  // If the backend sends 'uploads/image.png', this creates the full valid URL
  const imageUrl = stream?.thumbnailFile || stream?.thumbnail
    ? `${BACKEND_URL}/${stream.thumbnailFile || stream.thumbnail}`
    : "https://via.placeholder.com/300x180"; // Fallback if no image exists

  return (
    // ✅ 3. Wrap the card in a Link to make it clickable
    // We send the user to /stream/{id} so they can watch the video
    <Link to={`/live/${stream?._id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card">
        <img 
          src={imageUrl} 
          alt={stream?.title || "Stream thumbnail"} 
          style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x180" }} // Fixes broken links automatically
        />
        <h3 style={{ marginTop: "10px" }}>{stream?.title || "Untitled Stream"}</h3>
        <p style={{ color: "#aaa" }}>{stream?.game || "Just Chatting"}</p>
      </div>
    </Link>
  );
}

export default StreamCard;