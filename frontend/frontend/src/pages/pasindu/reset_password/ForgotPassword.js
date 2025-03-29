import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/forgot-password",
        { email }
      );
      setIsOtpSent(true);

      // ✅ Show SweetAlert popup
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "📩 Please check your email inbox.",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to send OTP",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/verify-otp",
        { email, otp }
      );

      // ✅ Show success Swal
      Swal.fire({
        icon: "success",
        title: "OTP Verified!",
        text: "You can now reset your password.",
        confirmButtonColor: "#3085d6",
      });

      localStorage.setItem("resetEmail", email.toLowerCase());
      navigate("/reset-password");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please double-check your code and try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSendingOtp}
            className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded-md font-semibold transition ${
              isSendingOtp
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSendingOtp && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>

          {message && (
            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-green-100 border border-green-300 text-green-700 text-sm">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {message}
            </div>
          )}
        </form>

        {isOtpSent && (
          <form
            onSubmit={handleOtpVerification}
            className="space-y-4 border-t pt-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
