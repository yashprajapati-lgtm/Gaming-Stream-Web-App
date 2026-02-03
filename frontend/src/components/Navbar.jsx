import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/live">Live</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/signup">Signup</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;
