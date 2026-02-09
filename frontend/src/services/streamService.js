// It must be the Render Link, NOT localhost
const API_URL = "https://gaming-stream-web-app.onrender.com/api/stream";

/*
  Stream Service
  Handles stream-related API calls
*/

// 🔹 Get Live Streams
export const getLiveStreams = async () => {
  try {
    const response = await fetch(`${API_URL}/live`);
    if (!response.ok) throw new Error("Failed to fetch streams");
    return await response.json();
  } catch (error) {
    console.error("Error fetching streams:", error);
    return []; // Return empty array so the app doesn't crash
  }
};

// 🔹 Create Stream (Protected)
export const createStream = async (streamData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(streamData)
  });

  return response.json();
};