// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Your Spring Boot backend base URL
  // You can add headers, interceptors, etc. if needed
});

export default axiosInstance;
