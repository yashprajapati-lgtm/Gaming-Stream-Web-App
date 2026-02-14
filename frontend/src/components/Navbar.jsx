import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // We'll add the styling next

function Navbar() {
  const navigate = useNavigate();
  // Check if the user has a token (is logged in)
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the key from the browser
    alert("Logged out successfully! See you soon. 🎮");
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">🚀 GameStream<span>Hub</span></Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/live">Live</Link>

        {/* Conditional Rendering: Show different links based on login status */}
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin">Admin</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="signup-highlight">Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;