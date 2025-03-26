import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Correctly import useNavigate

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // New state for OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/forgot-password",
        { email }
      );
      alert(response.data); // "OTP sent to email!"
      setIsOtpSent(true); // Set flag to true after OTP is sent
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/verify-otp",
        { email, otp }
      );
      alert(response.data); // OTP verified successfully!

      // Redirect user to reset password page
      navigate("/reset-password"); // Correct usage of navigate()
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send OTP</button>
      </form>

      {isOtpSent && (
        <form onSubmit={handleOtpVerification}>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
