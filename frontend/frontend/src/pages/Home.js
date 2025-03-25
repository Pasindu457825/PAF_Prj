import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to the Home Page</h2>
      <p>
        ➕ <Link to="/add-user">Create User</Link>
      </p>
      <p>
        📋 <Link to="/user-list">View Users</Link>
      </p>
    </div>
  );
};

export default Home;
