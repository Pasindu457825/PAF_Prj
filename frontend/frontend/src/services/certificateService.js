import axios from "axios";

const API_URL = "http://localhost:8080/api/certificates";

// Generate a certificate
export const generateCertificate = async (userId, courseId) => {
  try {
    const response = await axios.post(
      `${API_URL}/generate`,
      { userId, courseId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user certificates
export const getUserCertificates = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get certificate by ID
export const getCertificate = async (certificateId) => {
  try {
    const response = await axios.get(`${API_URL}/${certificateId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify certificate
export const verifyCertificate = async (certificateNumber) => {
  try {
    const response = await axios.get(`${API_URL}/verify/${certificateNumber}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
