import { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Admin API not available");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch(() => {
        setError("No users found or admin API not connected.");
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛠 Admin Panel</h2>

      {error && <p>{error}</p>}

      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.username} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
