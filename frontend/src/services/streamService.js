const API_URL = "http://localhost:5000/api/stream";

/*
  Stream Service
  Handles stream-related API calls
*/

// 🔹 Get Live Streams
export const getLiveStreams = async () => {
  const response = await fetch(`${API_URL}/live`);
  return response.json();
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
