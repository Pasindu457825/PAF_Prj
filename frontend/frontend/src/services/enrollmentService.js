import axios from 'axios';

const API_URL = 'http://localhost:8080/api/enrollments';

// Enroll in a course
export const enrollInCourse = async (userId, courseId) => {
  try {
    const response = await axios.post(API_URL, { userId, courseId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user enrollments
export const getUserEnrollments = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get completed enrollments
export const getCompletedEnrollments = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/completed`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get enrollment details
export const getEnrollment = async (enrollmentId) => {
  try {
    const response = await axios.get(`${API_URL}/${enrollmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update progress
export const updateProgress = async (enrollmentId, progressData) => {
  try {
    const response = await axios.put(`${API_URL}/${enrollmentId}/progress`, progressData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Find enrollment
export const findEnrollment = async (userId, courseId) => {
  try {
    const enrollments = await getUserEnrollments(userId);
    const enrollment = enrollments.find(e => e.course.id === parseInt(courseId));
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return enrollment;
  } catch (error) {
    throw error;
  }
};

// Get user enrollment stats
export const getUserEnrollmentStats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
