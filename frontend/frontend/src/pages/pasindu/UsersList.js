import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:8080/api/users/${id}`)
        .then(() => {
          alert("User deleted ✅");
          fetchUsers(); // refresh list
        })
        .catch((err) => {
          console.error("Delete failed:", err);
          alert("Failed to delete ❌");
        });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: "10px" }}>
              <strong>{user.name}</strong> — {user.email}{" "}
              <Link to={`/update/${user.id}`}>
                <button style={{ marginLeft: "1rem" }}>Edit</button>
              </Link>
              <button
                style={{ marginLeft: "0.5rem", backgroundColor: "#f87171" }}
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersPage;
