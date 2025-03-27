import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig";

const CreateUser = () => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let imageUrl = "";

      // ✅ Upload photo to Firebase if selected
      if (photo) {
        const fileRef = ref(
          storage,
          `profile-images/${form.username}_${photo.name}`
        );
        await uploadBytes(fileRef, photo);
        imageUrl = await getDownloadURL(fileRef);
      }

      // ✅ Submit user with profileImage to backend
      const userData = { ...form, profileImage: imageUrl };
      await axios.post("http://localhost:8080/api/users", userData);

      setMessage("User created successfully ✅");
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
      });
      setPhoto(null);
    } catch (err) {
      console.error("User creation failed:", err);
      setMessage("Failed to create user ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add User
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md transition"
        >
          🔐 Go to Login
        </button>
      </div>
    </div>
  );
};

export default CreateUser;
