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
    axios.get(`http://localhost:8080/api/users`).then((res) => {
      const user = res.data.find((u) => u.id === id);
      if (user) {
        setForm({ name: user.name, email: user.email });
      }
    });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8080/api/users/update/${id}`, form)
      .then(() => {
        setMessage("User updated ✅");
        setTimeout(() => navigate("/user-list"), 1500);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Update failed ❌");
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit User</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition duration-150"
        >
          Update User
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default UpdateUser;
