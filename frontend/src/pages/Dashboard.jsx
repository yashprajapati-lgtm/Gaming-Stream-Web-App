import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // ✅ 1. API URL synchronized with your live Render backend
  const API_URL = "https://gaming-stream-web-app.onrender.com/api";

  // ✅ 2. Security Check: Redirect to login if no token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first! 🔒");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ 3. Handle Stream Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!title || !video || !thumbnail) {
      alert("Please fill in all fields (Title, Video, and Thumbnail)");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    // Preparing Data for multipart/form-data upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("game", game || "Just Chatting");
    formData.append("description", description);
    formData.append("videoFile", video);      // Matches backend field name
    formData.append("thumbnailFile", thumbnail); // Matches backend field name

    try {
      // ✅ Fetching from the stream creation endpoint
      const res = await fetch(`${API_URL}/stream/create`, {
        method: "POST",
        headers: {
          // ⚡ Authorization header fixes the 'Invalid Token' issue
          "Authorization": token 
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Stream Created Successfully! You are now live.");
        navigate("/"); 
      } else {
        // Handling backend rejection
        alert("❌ Upload Failed: " + (data.message || "Session expired. Please re-login."));
        console.error("Upload Error:", data);
        
        if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
        }
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("❌ Server connection error. Please try again later.");
    } finally {
      setLoading(false); // ✅ Ensures button re-enables
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>🚀 Streamer Dashboard</h1>
        <p className="subtitle">Upload your gameplay and go live instantly.</p>

        <form onSubmit={handleUpload} className="upload-form">
          
          <div className="form-group">
            <label>Stream Title</label>
            <input 
              type="text" 
              placeholder="Ex: PRO VALORANT RANKED MATCH" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Game Category</label>
            <input 
              type="text" 
              placeholder="Ex: Minecraft, GTA V..." 
              value={game} 
              onChange={(e) => setGame(e.target.value)} 
            />
          </div>

           <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Tell viewers about your stream..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="file-group">
            <div className="file-input">
              <label>📸 Thumbnail (Image)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setThumbnail(e.target.files[0])} 
                required
              />
            </div>

            <div className="file-input">
              <label>🎥 Gameplay (Video)</label>
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => setVideo(e.target.files[0])} 
                required
              />
            </div>
          </div>

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "🚀 Uploading... (Please Wait)" : "🔴 Go Live Now"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Dashboard;