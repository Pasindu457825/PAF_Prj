import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { deleteUserById } from "../pasindu/DeleteUser"; // ✅ import here

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: "10px" }}>
              <strong>{user.name}</strong> — {user.email}
              <Link to={`/edit/${user.id}`}>
                <button style={{ marginLeft: "1rem" }}>Edit</button>
              </Link>
              <button
                onClick={() => deleteUserById(user.id, fetchUsers)}
                style={{
                  marginLeft: "0.5rem",
                  backgroundColor: "#f87171",
                  border: "none",
                  padding: "5px 10px",
                  color: "white",
                  cursor: "pointer",
                }}
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

export default UserList;
