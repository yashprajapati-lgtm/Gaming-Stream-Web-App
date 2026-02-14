import React, { useState, useEffect } from "react";
import "./Admin.css"; 

function Admin() {
  const [streams, setStreams] = useState([]);
  const [error, setError] = useState("");

  // ✅ USE YOUR RENDER BACKEND URL
  const API_URL = "https://gaming-stream-web-app.onrender.com";

  // 1. Fetch All Streams
  const fetchStreams = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stream`);
      if (!response.ok) throw new Error("Failed to fetch streams");
      const data = await response.json();
      setStreams(data);
    } catch (err) {
      console.error("Error fetching streams:", err);
      setError("Failed to load streams. Is the backend running?");
    }
  };

  // Run this when the page loads
  useEffect(() => {
    fetchStreams();
  }, []);

  // 2. Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this stream?")) {
      try {
        const res = await fetch(`${API_URL}/api/stream/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
           alert("✅ Stream Deleted Successfully!");
           // Refresh the list immediately so it disappears
           fetchStreams(); 
        } else {
           alert("❌ Failed to delete. Check console.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error connecting to server.");
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>👮‍♂️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>Total Streams</h3>
          <p>{streams.length}</p>
        </div>
        <div className="card">
          <h3>Status</h3>
          <p style={{ fontSize: "18px", color: "#00e676" }}>System Online 🟢</p>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Manage Streams</h2>
      
      {streams.length === 0 ? (
        <p>No streams found.</p>
      ) : (
        <table className="stream-table">
          <thead>
            <tr>
              <th>Stream Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream._id}>
                <td><strong>{stream.title}</strong></td>
                <td style={{ color: "#aaa" }}>
                  {stream.description ? stream.description.substring(0, 30) + "..." : "No desc"}
                </td>
                <td>
                  <span className={stream.isLive ? "badge live" : "badge offline"}>
                    {stream.isLive ? "LIVE" : "OFFLINE"}
                  </span>
                </td>
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(stream._id)}
                  >
                    Delete 🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;