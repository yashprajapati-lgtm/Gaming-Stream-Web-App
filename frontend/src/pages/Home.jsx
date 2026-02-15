
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import StreamCard from "../components/StreamCard";
import "./Home.css"; // ✅ Import the new styles

function Home() {
  const [streams, setStreams] = useState([]);
  const API_URL = "https://gaming-stream-web-app.onrender.com"; // Your Render URL

  useEffect(() => {
    fetch(`${API_URL}/api/stream/live`)
      .then((res) => res.json())
      .then((data) => setStreams(data))
      .catch((err) => console.error("Error fetching streams:", err));
  }, []);

  return (
    <div className="home-container">
      
      {/* 🦸‍♂️ Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">NEXT LEVEL GAMING</h1>
          <p className="hero-subtitle">
            Join the community. Watch live streams. Chat with gamers worldwide.
          </p>
          {/* Scroll down to streams on click */}
          <button className="cta-button" onClick={() => window.scrollTo(0, 500)}>
            Start Watching 🎮
          </button>
        </div>
      </div>

      {/* 📺 Live Streams Section */}
      <div className="streams-section">
        <div className="section-header">
          <h2>🔥 Live Channels</h2>
          <span className="live-badge">LIVE</span>
        </div>

        {streams.length > 0 ? (
          <div className="streams-grid">
            {streams.map((stream) => (
              <StreamCard key={stream._id} stream={stream} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
            <h3>No one is live right now 😢</h3>
            <p>Be the first to go live!</p>
            <Link to="/dashboard">
              <button className="cta-button" style={{ marginTop: "20px" }}>Go Live Now</button>
            </Link>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default Home;