import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig";
import { User, Mail, UserCheck, Camera, Save, ArrowLeft } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users`);
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
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to load user data ❌");
      }
    };

    fetchUser();
  }, [id]);

  // Handle file preview
  useEffect(() => {
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(photo);
    } else {
      setPreviewUrl("");
    }
  }, [photo]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

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
      setMessage("Profile updated successfully ✅");
      setTimeout(() => navigate("/myprofile"), 1500);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Your Profile</h2>
            <button
              onClick={() => navigate("/myprofile")}
              className="flex items-center text-sm font-medium text-indigo-100 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Profile
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md">
                <img
                  src={
                    previewUrl ||
                    form.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition-colors"
              >
                <Camera size={18} />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
            {photo && (
              <p className="text-sm text-gray-600 mb-2">
                New photo selected: {photo.name}
              </p>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* User Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {message && (
              <div
                className={`p-3 rounded-lg text-center text-sm ${
                  message.includes("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/myprofile")}
                className="sm:w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`sm:w-1/2 py-2 px-4 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white mr-2"></span>
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
