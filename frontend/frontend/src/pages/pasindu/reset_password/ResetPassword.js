import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("Email not found. Please go through OTP verification first.");
      navigate("/forgot-password"); // or your OTP page
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Sending reset request with:", { email, newPassword });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/reset-password",
        {
          email,
          newPassword,
        }
      );
      alert("Password reset successfully!");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password: ", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleResetPassword}>
        <input
          className="p-5"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
