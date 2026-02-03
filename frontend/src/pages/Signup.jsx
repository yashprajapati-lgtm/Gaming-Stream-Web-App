import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We trim simply to ensure clean data is sent
        body: JSON.stringify({ 
          username, 
          email: email.trim().toLowerCase(), 
          password: password.trim() 
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/login"); // Redirect to login page
      } else {
        alert("Signup Failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Create Account</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have an account? <Link to="/login" style={{ color: "cyan" }}>Login here</Link>
      </p>
    </div>
  );
}

export default Signup;