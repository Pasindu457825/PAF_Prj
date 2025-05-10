import React, { useState } from "react";
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // In real app, these would be imported from react-router-dom and axios/sweetalert2
  const navigate = useNavigate();

  const handleLoginRequest = async (credentials) => {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      credentials
    );
    return response.data;
  };

  const showAlert = (config) => console.log("Alert:", config);

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(credentials.email))
      newErrors.email = "Email is invalid";

    if (!credentials.password) newErrors.password = "Password is required";
    else if (credentials.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = await handleLoginRequest(credentials);

      // Save user details and login time
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("loginTime", new Date().toISOString());
      sessionStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));

      // Success alert
      showAlert({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/myprofile");
    } catch (err) {
      console.error("Login failed", err);
      showAlert({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Welcome Back
          </h2>
          <p className="text-blue-100 text-center mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Login Form Contents */}
        <div className="p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail size={16} className="mr-2" /> Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="yourname@example.com"
                  value={credentials.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Lock size={16} className="mr-2" /> Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot your password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg
                font-medium transition-all ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging In...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Log In
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          {/* <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="border-t border-gray-200 absolute w-full"></div>
            <div className="bg-white px-3 relative text-gray-500 text-sm">
              or
            </div>
          </div> */}

          {/* Social Login Buttons */}
          {/* <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src="/api/placeholder/24/24"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src="/api/placeholder/24/24"
                alt="Facebook"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div> */}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
              >
                Sign up now <ArrowRight size={16} className="ml-1" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
