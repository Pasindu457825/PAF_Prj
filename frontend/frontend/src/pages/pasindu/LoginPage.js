import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );

      console.log("Login Success:", res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));

      // ✅ SweetAlert for success
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/myprofile");
    } catch (err) {
      console.error("Login failed", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password ❌",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-4 w-full text-blue-600 hover:underline text-sm text-center"
        >
          Forgot Password?
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
