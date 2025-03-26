import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig"; // adjust path if needed

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/users`).then((res) => {
      const user = res.data.find((u) => u.id === id);
      if (user) {
        setForm({
          username: user.username || "",
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          profileImage: user.profileImage || "",
        });
      }
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.profileImage;

      if (photo) {
        const fileRef = ref(
          storage,
          `profile-images/${form.username}_${photo.name}`
        );
        await uploadBytes(fileRef, photo);
        imageUrl = await getDownloadURL(fileRef);
      }

      const updatedUser = { ...form, profileImage: imageUrl };

      await axios.put(
        `http://localhost:8080/api/users/update/${id}`,
        updatedUser
      );

      sessionStorage.setItem("user", JSON.stringify({ ...updatedUser, id }));
      setMessage("User updated ✅");
      setTimeout(() => navigate("/myprofile"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Update failed ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Edit Profile
      </h2>

      {form.profileImage && (
        <img
          src={form.profileImage}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mx-auto mb-4 shadow"
        />
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
        >
          Update Profile
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default UpdateUser;
