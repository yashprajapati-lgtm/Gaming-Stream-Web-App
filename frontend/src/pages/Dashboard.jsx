import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null); // <--- 1. NEW STATE
  const [myStreams, setMyStreams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
    } else {
      fetchStreams();
    }
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stream/live");
      const data = await response.json();
      setMyStreams(data);
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  };

  const handleCreateStream = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("game", game);
    if (file) formData.append("videoFile", file);
    if (thumbnail) formData.append("thumbnailFile", thumbnail); // <--- 2. SEND THUMBNAIL

    try {
      const response = await fetch("http://localhost:5000/api/stream/create", {
        method: "POST",
        headers: { "Authorization": token },
        body: formData
      });

      if (response.ok) {
        alert("Stream Created!");
        setTitle("");
        setGame("");
        setFile(null);
        setThumbnail(null);
        fetchStreams();
      } else {
        alert("Upload Failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this stream?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/stream/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": token }
      });
      if (response.ok) {
        alert("Deleted Successfully");
        fetchStreams();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📊 Streamer Dashboard</h2>

      {/* CREATE SECTION */}
      <div style={{ background: "#1e293b", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h3>Create New Stream</h3>
        
        <input type="text" placeholder="Stream Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }} />
        
        <input type="text" placeholder="Game Name" value={game} onChange={(e) => setGame(e.target.value)} style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }} />

        {/* --- 3. PASTE THE THUMBNAIL INPUT HERE --- */}
        <label style={{display:'block', marginTop:'10px', fontWeight:'bold'}}>Thumbnail Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setThumbnail(e.target.files[0])} 
          style={{ display: "block", margin: "5px 0 15px 0" }} 
        />

        <label style={{display:'block', fontWeight:'bold'}}>Video File:</label>
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "block", margin: "5px 0 20px 0" }} />
        
        
        <button onClick={handleCreateStream} style={{ padding: "10px 20px", background: "#38bdf8", border: "none", cursor: "pointer", fontSize: "16px", borderRadius: "4px" }}>Go Live 🔴</button>
      </div>

      {/* MANAGE SECTION */}
      <h3>My Active Streams</h3>
      {myStreams.length === 0 ? (
        <p>No active streams found.</p>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          {myStreams.map((stream) => (
            <div key={stream._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#334155", padding: "10px", borderRadius: "5px" }}>
              <div>
                <strong>{stream.title}</strong> - <span style={{ color: "#94a3b8" }}>{stream.game}</span>
              </div>
              <button onClick={() => handleDelete(stream._id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;