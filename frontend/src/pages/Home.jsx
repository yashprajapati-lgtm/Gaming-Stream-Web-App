import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLiveStreams } from "../services/streamService"; 

function Home() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    getLiveStreams().then((data) => {
      setStreams(data);
    });
  }, []);

  // YOUR CLOUD BACKEND URL (No slash at the end)
  const API_URL = "https://gaming-stream-web-app.onrender.com";

  return (
    <div className="home">
      <section className="hero">
        <h1>🎮 Watch Live Gaming Streams</h1>
        <p>Stream • Watch • Chat with gamers worldwide</p>
      </section>

      <section className="streams">
        <h2>🔥 Live Streams</h2>
        <div className="stream-grid">
          {streams.length === 0 ? (
            <p>No streams live right now.</p>
          ) : (
            streams.map((stream) => (
              <Link 
                to={`/live/${stream._id}`} 
                state={stream} 
                key={stream._id} 
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <div className="card">
                  {/* ✅ FIXED: Uses Cloud URL for images now */}
                  <img
                    src={stream.thumbnailUrl ? `${API_URL}${stream.thumbnailUrl}` : "https://via.placeholder.com/300x180"} 
                    alt="stream" 
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                  <h3>{stream.title}</h3>
                  <p>👤 {stream.game}</p>
                  <p>👁 {stream.viewers} viewers</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;