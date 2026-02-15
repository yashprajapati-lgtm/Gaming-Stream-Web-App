import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Connect directly to your Render Backend
  const API_URL = "https://gaming-stream-web-app.onrender.com/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), // ✅ Matches backend trim/lowercase
          password: password.trim() 
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // ✅ SAVE THE TOKEN
        localStorage.setItem("token", data.token);
        alert("Login successful! 🔓");
        navigate("/dashboard");
      } else {
        // This catches "Email not found" or "Invalid password" from your backend
        alert("❌ Login Failed: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      // This triggers if the Render server is sleeping
      console.error("Login Error:", error);
      alert("❌ Could not reach the server. Please wait 60 seconds for Render to wake up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🎮 Login to GameStream</h2>
        <p>Welcome back, Gamer!</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /> 
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;