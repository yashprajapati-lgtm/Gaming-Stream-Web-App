import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ChatBox.css";
// ✅ FIX 1: Connect to your RENDER URL (Not Localhost!)
const socket = io.connect("https://gaming-stream-web-app.onrender.com");

function ChatBox({ roomId, username }) { 
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // ✅ FIX 2: Join the specific Room ID (This was likely missing!)
  useEffect(() => {
    if (roomId) {
      socket.emit("join_room", roomId);
      console.log(`Connected to Room: ${roomId}`);
    }
  }, [roomId]);

  // ✅ FIX 3: Listen for messages from others
  useEffect(() => {
    const receiveHandler = (data) => {
      console.log("Message Received:", data); // Debug log
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveHandler);
    
    // Cleanup to prevent double messages
    return () => socket.off("receive_message", receiveHandler);
  }, []); // Run only once

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: roomId, // Must match the room we joined!
        author: username || "Guest",
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      // Send to server
      await socket.emit("send_message", messageData);
      
      // Add to my own screen immediately
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat 💬</p>
      </div>
      <div className="chat-body">
        {messageList.map((msg, index) => (
          <div className="message" key={index} id={username === msg.author ? "you" : "other"}>
            <div>
              <div className="message-content">
                <p>{msg.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{msg.time}</p>
                <p id="author">{msg.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => { event.key === "Enter" && sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;