import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; 
import ChatBox from "../components/ChatBox";

function LiveStream() {
  const { id } = useParams(); 
  const location = useLocation();
  
  // ✅ 1. SETUP: Use your Render Backend URL here!
  const API_URL = "https://gaming-stream-web-app.onrender.com";

  // 2. Initial State
  const [stream, setStream] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state); 

  // 3. Fetch Data (Only runs if we don't have the stream yet)
  useEffect(() => {
    if (!stream) {
      console.log("Fetching stream data from server...");
      // ✅ FIX: Use API_URL instead of localhost
      fetch(`${API_URL}/api/stream/${id}`) 
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

  // 4. Loading State
  if (loading) {
    return (
      <div style={{ background: "#18181b", height: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2>Loading Stream...</h2>
      </div>
    );
  }

  // 5. Error State 
  if (!stream) {
    return (
      <div style={{ background: "#18181b", height: "100vh", color: "white", textAlign: "center", paddingTop: "50px" }}>
        <h2>Stream not found 😢</h2>
      </div>
    );
  }

  // 6. The Layout (Video Left, Chat Right)
  return (
    <div style={{ background: "#0e0e10", minHeight: "100vh", color: "white" }}>
      
      <div className="live-container" style={{ display: "flex", flexWrap: "wrap", height: "calc(100vh - 60px)" }}>
        
        {/* Left Side: Video Player */}
        <div style={{ flex: 3, padding: "20px", minWidth: "600px" }}>
          <div style={{ background: "black", width: "100%", height: "450px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
             {/* ✅ FIX: Use API_URL for the video source */}
             <video 
               controls 
               autoPlay 
               style={{ width: "100%", height: "100%", borderRadius: "10px" }}
               src={stream.videoUrl ? `${API_URL}${stream.videoUrl}` : ""} 
             ></video>
          </div>
          
          <div style={{ marginTop: "20px" }}>
            <h1 style={{ fontSize: "24px", margin: "0 0 10px 0" }}>{stream.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={`https://ui-avatars.com/api/?name=${stream.game}&background=random`} alt="game" style={{ width: "40px", height: "40px", borderRadius: "5px" }} />
                <div>
                    <p style={{ color: "#9147ff", fontWeight: "bold", margin: 0 }}>{stream.game}</p>
                    <p style={{ color: "#adadb8", fontSize: "12px", margin: 0 }}>Live now</p>
                </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Box */}
        <div style={{ flex: 1, minWidth: "300px", borderLeft: "1px solid #333", background: "#18181b" }}>
          {/* We pass the stream ID so users join the correct chat room */}
          <ChatBox roomId={id} username="User" />
        </div>

      </div>
    </div>
  );
}

export default LiveStream;