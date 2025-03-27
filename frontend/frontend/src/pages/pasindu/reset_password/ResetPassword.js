import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" }); // ✅ New state
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("Email not found. Please go through OTP verification first.");
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "❌ Passwords do not match.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/reset-password", {
        email,
        newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Successful!",
        text: "✅ Redirecting to login page...",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error resetting password: ", error);
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: "❌ Failed to reset password. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const renderNotification = () => {
    if (!notification.message) return null;

    const styles =
      notification.type === "success"
        ? "bg-green-100 border-green-400 text-green-700"
        : "bg-red-100 border-red-400 text-red-700";

    return (
      <div className={`px-4 py-3 rounded-md border ${styles} text-sm`}>
        {notification.message}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-600">
          Reset Password
        </h2>

        {/* ✅ Notification Message */}
        {renderNotification()}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
