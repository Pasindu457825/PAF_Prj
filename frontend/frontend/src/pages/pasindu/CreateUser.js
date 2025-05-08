import React, { useState } from "react";
import {
  Mail,
  User,
  Lock,
  Camera,
  AtSign,
  UserPlus,
  LogIn,
  UserCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Add this at the top

const CreateUser = () => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Navigation function (simulating react-router-dom's useNavigate)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";

    if (!form.username) newErrors.username = "Username is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setMessage("");
    setLoading(true);

    try {
      const userData = {
        ...form,
        profileImage: photoPreview || "", // send base64 if needed
      };

      const response = await axios.post(
        "http://localhost:8080/api/users",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("User created:", response.data);
      setMessage("User created successfully ✅");
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
      });
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err) {
      console.error("User creation failed:", err);
      setMessage("Failed to create user ❌");
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex items-center justify-center mb-2">
            <UserPlus size={24} className="text-white mr-2" />
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
          </div>
          <p className="text-blue-100 text-center text-sm">
            Join our community and start connecting
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera size={32} className="text-gray-400" />
                  </div>
                )}
              </div>

              <label className="mt-2 cursor-pointer">
                <span className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <Camera size={16} className="mr-1" />
                  {photo ? "Change photo" : "Upload photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail size={16} className="mr-2" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="yourname@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                    ${
                      errors.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle size={12} className="mr-1" /> {errors.email}
                  </div>
                )}
              </div>
            </div>

            {/* First & Last Name - Two columns */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User size={16} className="mr-2" /> First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                      ${
                        errors.firstName
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                  />
                  {errors.firstName && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircle size={12} className="mr-1" />{" "}
                      {errors.firstName}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User size={16} className="mr-2" /> Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                      ${
                        errors.lastName
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                  />
                  {errors.lastName && (
                    <div className="flex items-center mt-1 text-red-500 text-xs">
                      <AlertCircle size={12} className="mr-1" />{" "}
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <AtSign size={16} className="mr-2" /> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                    ${
                      errors.username
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.username && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle size={12} className="mr-1" /> {errors.username}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Lock size={16} className="mr-2" /> Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                    ${
                      errors.password
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.password && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle size={12} className="mr-1" /> {errors.password}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg 
                font-medium transition-all mt-4 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserCheck size={18} className="mr-2" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-medium 
                ${
                  message.includes("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {message}
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6">
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
                >
                  Login <LogIn size={16} className="ml-1" />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
