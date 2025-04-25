import { deleteUserById } from "../pasindu/DeleteUser";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteUserById(user.id);
        sessionStorage.removeItem("user");
        navigate("/login");
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete user ❌");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Actions */}
        <div className="md:w-1/3 p-6 border-r border-gray-300 bg-white bg-opacity-70">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            🎯 Actions
          </h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/update-user/${user.id}`)}
              className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow transition"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() => navigate("/myposts")}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
            >
              📄 My Posts
            </button>
            <button
              onClick={() => navigate(`/groups/${user.id}`)}
              className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow transition"
            >
              👥 My Groups
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("user");
                navigate("/login");
              }}
              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
            >
              My Notification
        </button>
        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          onClick={() => navigate("/followUsers")}
        >
          My Friend
        </button>
        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          onClick={() => navigate("/allUsers")}
        >
          Add Friend
        </button>
        <button
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          onClick={() => {
            sessionStorage.removeItem("user");
            navigate("/login");
          }}
        >
              🚪 Logout
            </button>
            <button
              onClick={handleDelete}
              className="py-2 px-4 bg-gray-800 hover:bg-black text-white rounded-lg shadow transition"
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>

        {/* Profile Main */}
        <div className="md:w-2/3 p-8 relative">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-br from-blue-400 to-indigo-600 shadow-md">
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm text-gray-600 mt-1">📧 {user.email}</p>
          </div>

          {/* Profile Info Section */}
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            👤 Profile Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-500">Username</p>
              <p>{user.username}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-500">First Name</p>
              <p>{user.firstName}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-500">Last Name</p>
              <p>{user.lastName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
