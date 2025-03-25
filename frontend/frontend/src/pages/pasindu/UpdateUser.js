import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  // Load user data on mount
  useEffect(() => {
    axios.get(`http://localhost:8080/api/users`)
      .then((res) => {
        const user = res.data.find((u) => u.id === id);
        if (user) {
          setForm({ name: user.name, email: user.email });
        }
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:8080/api/users/${id}`, form)
      .then(() => {
        setMessage("User updated ✅");
        setTimeout(() => navigate("/users"), 1500);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Update failed ❌");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit User</h2>
      <form onSubmit={handleUpdate}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br />
        <button type="submit">Update User</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UpdateUser;
