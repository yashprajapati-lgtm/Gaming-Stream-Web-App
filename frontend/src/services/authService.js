// ✅ UPDATE THIS TO YOUR RENDER LINK
const API_URL = "https://gaming-stream-web-app.onrender.com/api/auth";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
};