import { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => {
        // If backend admin API is missing
        setUsers([]);
      });
  }, []);

  return (
    <div>
      <h2>🛠 Admin Panel</h2>

      {users.length === 0 ? (
        <p>No users found or admin API not connected.</p>
      ) : (
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
