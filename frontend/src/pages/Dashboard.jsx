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

  // ✅ 1. Corrected API URL (Matches your backend service)
  const API_URL = "https://gaming-stream-web-app.onrender.com/api";

  // ✅ 2. Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ 3. Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!title || !video || !thumbnail) {
      alert("Please fill in all fields (Title, Video, and Thumbnail)");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    // Using FormData for file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("game", game || "Just Chatting");
    formData.append("description", description);
    formData.append("videoFile", video);      // Backend expects 'videoFile'
    formData.append("thumbnailFile", thumbnail); // Backend expects 'thumbnailFile'

    try {
      // ✅ FIX: Removed the extra '/api' from the path to avoid 404 errors
      const res = await fetch(`${API_URL}/stream/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // ✅ Required to fix "Invalid token"
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Stream Created Successfully!");
        navigate("/"); 
      } else {
        alert("❌ Upload Failed: " + (data.message || "Unknown Error"));
        console.error("Upload Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("❌ Network Error. Check console.");
    } finally {

    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>🚀 Streamer Dashboard</h1>
        <p className="subtitle">Upload your gameplay and go live.</p>

        <form onSubmit={handleUpload} className="upload-form">
          
          <div className="form-group">
            <label>Stream Title</label>
            <input 
              type="text" 
              placeholder="Ex: PRO VALORANT RANKED MATCH" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
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
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
            </div>

            <div className="file-input">
              <label>🎥 Gameplay (Video)</label>
              <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading... (Please Wait)" : "🔴 Go Live Now"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Dashboard;