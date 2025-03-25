import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
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
              <strong>{user.name}</strong> — {user.email}{" "}
              <Link to={`/update/${user.id}`}>
                <button style={{ marginLeft: "1rem" }}>Edit</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersPage;
