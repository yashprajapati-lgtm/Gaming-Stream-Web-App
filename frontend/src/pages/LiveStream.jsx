import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import hooks
import ChatBox from "../components/ChatBox";

function LiveStream() {
  const { id } = useParams(); // Get the ID from the URL (e.g., /stream/123)
  const location = useLocation();
  
  // 1. Initial State: Use data passed from Home IF it exists, otherwise null
  const [stream, setStream] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state); // Show loading only if we don't have data yet

  // 2. Fetch Data (Only runs if we don't have the stream yet)
  useEffect(() => {
    if (!stream) {
      console.log("Fetching stream data from server...");
      fetch(`http://localhost:5000/api/stream/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setStream(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching stream:", err);
          setLoading(false);
        });
    }
  }, [id, stream]);

  // 3. Loading State
  if (loading) {
    return (
      <div style={{ background: "#0f172a", height: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2>Loading Stream...</h2>
      </div>
    );
  }

  // 4. Error State (If ID is wrong)
  if (!stream) {
    return (
      <div style={{ background: "#0f172a", height: "100vh", color: "white", textAlign: "center", paddingTop: "50px" }}>
        <h2>Stream not found 😢</h2>
      </div>
    );
  }

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white" }}>
      
      <div className="live-container" style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        {/* Left: Video Player */}
        <div style={{ flex: 3, padding: "20px" }}>
          <video 
            controls 
            autoPlay 
            style={{ width: "100%", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
            src={`http://localhost:5000${stream.videoUrl}`} // Use the stream URL
          ></video>
          
          <div style={{ marginTop: "20px" }}>
            <h1 style={{ fontSize: "24px" }}>{stream.title}</h1>
            <p style={{ color: "#94a3b8" }}>Playing: <span style={{ color: "#38bdf8" }}>{stream.game}</span></p>
          </div>
        </div>

        {/* Right: Chat Box */}
        <div style={{ flex: 1, borderLeft: "1px solid #334155" }}>
          <ChatBox streamId={stream._id} />
        </div>
      </div>
    </div>
  );
}

export default LiveStream;