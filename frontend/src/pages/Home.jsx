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

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>🎮 Watch Live Gaming Streams</h1>
        <p>Stream • Watch • Chat with gamers worldwide</p>
      </section>

      {/* Live Streams Grid */}
      <section className="streams">
        <h2>🔥 Live Streams</h2>

        <div className="stream-grid">
          {streams.length === 0 ? (
            <p>No streams live right now.</p>
          ) : (
            streams.map((stream) => (
              /* LINK UPDATED: Now points to /live/STREAM_ID */
              <Link 
                to={`/live/${stream._id}`} 
                state={stream} 
                key={stream._id} 
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <div className="card">
                  {/* Thumbnail Image */}
                  <img
                    src={stream.thumbnailUrl ? `http://localhost:5000${stream.thumbnailUrl}` : "https://via.placeholder.com/300x180"} 
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