import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // Assuming email is passed as a prop or already available
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/reset-password",
        { email, newPassword } // Ensure both email and newPassword are being sent
      );
      console.log("Password reset successful", response.data);
      alert("Password reset successfully!");
    } catch (error) {
      console.error("Error resetting password: ", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
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
