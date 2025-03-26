import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/forgot-password",
        { email }
      );
      console.log("✅ OTP Sent:", response.data);
      setSuccess("✅ Reset link sent! Check your email.");
      setError(""); // Clear error if successful
    } catch (error) {
      console.error("❌ OTP Failed:", error.response?.data || error.message);
      setError("❌ Failed to send reset link. Try again!");
      setSuccess(""); // Clear success message if error occurs
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        {success && (
          <p className="mt-4 text-green-600 text-center">{success}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
