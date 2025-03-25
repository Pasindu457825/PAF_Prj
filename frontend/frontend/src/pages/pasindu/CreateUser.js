import React, { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/users", form)
      .then((res) => {
        console.log(res.data);
        setMessage("User created successfully ✅");
        setForm({ name: "", email: "" });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to create user ❌");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />
        <button type="submit">Add User</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateUser;
