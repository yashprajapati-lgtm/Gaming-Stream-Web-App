
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; 

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(""); // ✅ Added Bio state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Keep your base URL as is
  const API_URL = "https://gaming-stream-web-app.onrender.com/api"; 

  try {
    // ⚡ FIX: Path changed to /auth/register to match auth.routes.js
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, bio }),
    });

    if (res.ok) {
      alert("✅ Account created! Redirecting to login...");
      navigate("/login");
    } else {
      const data = await res.json();
      alert("❌ Signup Failed: " + data.message);
    }
  } catch (error) {
    // Catches the SyntaxError from 404 HTML pages
    console.error("Signup Error:", error);
    alert("❌ Server Error: Make sure your Render backend is awake!");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🎮 Join GameStream</h2>
        <p>Start your streaming journey today.</p>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Pick a gamer name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ New Bio Field */}
          <div className="input-group">
            <label>About Me (Bio)</label>
            <textarea
              placeholder="Tell us about your gaming style..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#0e0e10', border: '1px solid #333', color: 'white', borderRadius: '6px' }}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#a1a1aa" }}>
          Already have an account? <Link to="/login" style={{ color: "#9147ff" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;