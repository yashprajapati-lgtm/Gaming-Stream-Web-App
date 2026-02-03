import ChatBox from "../components/ChatBox";

function LiveStream() {
  return (
    <div className="live-container">
      {/* Video */}
      <div className="video-section">
        <video className="video-player" controls>
          <source src="" type="video/mp4" />
        </video>
      </div>

      {/* Chat */}
      <div className="chat-section">
        
      </div>
    </div>
  );
}

export default LiveStream;
