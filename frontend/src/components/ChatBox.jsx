import { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to Backend
const socket = io.connect("http://localhost:5000");

function ChatBox({ streamId }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("Viewer"); // Default name

  // 1. Join the Room when component loads
  useEffect(() => {
    if (streamId) {
      socket.emit("join_room", streamId);
    }
  }, [streamId]);

  // 2. Listen for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup to prevent double messages
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  // 3. Send Message Function
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: streamId,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]); // Add my own message to list
      setCurrentMessage("");
    }
  };

  return (
    <div className="chat-box" style={{ background: "#0f172a", height: "100%", display: "flex", flexDirection: "column", borderLeft: "1px solid #334155" }}>
      
      {/* Header */}
      <div style={{ padding: "10px", background: "#1e293b", borderBottom: "1px solid #334155", color: "white" }}>
        <h3>Live Chat</h3>
        <input 
          type="text" 
          placeholder="Enter your name..." 
          onChange={(e) => setUsername(e.target.value)}
          style={{ background: "transparent", border: "1px solid #475569", color: "#94a3b8", padding: "4px", fontSize: "12px", marginTop: "5px" }} 
        />
      </div>

      {/* Messages Window */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto", color: "white" }}>
        {messageList.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong style={{ color: "#38bdf8" }}>{msg.author}: </strong>
            <span>{msg.message}</span>
            <span style={{ fontSize: "10px", color: "#64748b", marginLeft: "8px" }}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: "10px", background: "#1e293b", display: "flex" }}>
        <input
          type="text"
          value={currentMessage}
          placeholder="Say something..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "none" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "5px", padding: "8px 15px", background: "#22c55e", border: "none", color: "white", cursor: "pointer", borderRadius: "4px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;