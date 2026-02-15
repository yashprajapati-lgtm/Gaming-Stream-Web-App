import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        // ✅ SAVE THE RENDER TOKEN
        localStorage.setItem("token", data.token);
        alert("Login successful! 🔓");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        alert("Invalid credentials: " + (data.message || "Try again"));
      }
    } catch (error) {
      alert("Login failed. Is the server awake?");
    } finally {
      setLoading(false);
    
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🎮 Login to GameStream</h2>
        

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