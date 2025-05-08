import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const getCurrentUser = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/auth/current-user",
      { withCredentials: true }
    ); // Ensure correct URL
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

const login = async (creds) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      creds
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    // checkLoggedIn();

    const localStUser = JSON.parse(sessionStorage.getItem("user"));
    if (localStUser) {
      setUser(localStUser);
      setIsAuthenticated(true);
    }
  }, []);

  const loginUser = async (credentials) => {
    try {
      const userData = await login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const newUser = await register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("userId", newUser.id);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login: loginUser,
        register: registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
