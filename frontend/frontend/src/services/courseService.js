import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";

// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/getall`, {
      withCredentials: true, // if using session cookies
    });
    // Ensure we return an array with complete course objects
    const courses = Array.isArray(response.data) ? response.data : [];

    // Add default author if missing
    return courses.map((course) => ({
      ...course,
      author: course.author || { name: "Unknown author" },
      units: course.units || [],
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

// Get a course by ID
export const getCourseById = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/${courseId}`, {
      withCredentials: true,
    });

    // Ensure author is present with at least a name property
    if (response.data && !response.data.author) {
      response.data.author = { name: "Unknown author" };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    // If courseData is already FormData, use it directly
    // Otherwise, create a new FormData object
    const formData =
      courseData instanceof FormData ? courseData : new FormData();

    // If we created a new FormData, populate it
    if (!(courseData instanceof FormData)) {
      Object.keys(courseData).forEach((key) => {
        if (key === "units") {
          formData.append("units", JSON.stringify(courseData.units));
        } else if (key === "pdfFile" && courseData.pdfFile) {
          formData.append("pdfFile", courseData.pdfFile);
        } else {
          formData.append(key, courseData[key]);
        }
      });
    }

    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    // If courseData is already FormData, use it directly
    // Otherwise, create a new FormData object
    const formData =
      courseData instanceof FormData ? courseData : new FormData();

    // If we created a new FormData, populate it
    if (!(courseData instanceof FormData)) {
      Object.keys(courseData).forEach((key) => {
        if (key === "units") {
          formData.append("units", JSON.stringify(courseData.units));
        } else if (key === "pdfFile" && courseData.pdfFile) {
          formData.append("pdfFile", courseData.pdfFile);
        } else {
          formData.append(key, courseData[key]);
        }
      });
    }

    const response = await axios.put(`${API_URL}/${courseId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete a course - improved version with proper error handling
export const deleteCourse = async (courseId, userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${courseId}?userId=${userId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    if (error.response?.status === 403) {
      throw new Error("You do not have permission to delete this course");
    } else if (error.response?.status === 404) {
      throw new Error("Course not found");
    } else {
      throw new Error("Failed to delete course");
    }
  }
};

// Get courses by author - with cache busting to ensure latest data
export const getCoursesByAuthor = async (authorId) => {
  try {
    // Add timestamp parameter to prevent caching
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_URL}/author/${authorId}`, {
      withCredentials: true,
    });
    // Ensure we return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching author courses:", error);
    return [];
  }
};

// Search courses
export const searchCourses = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`, {
      withCredentials: true,
    });
    // Ensure we return an array with complete course objects
    const results = Array.isArray(response.data) ? response.data : [];

    // Add default author if missing
    return results.map((course) => ({
      ...course,
      author: course.author || { name: "Unknown author" },
      units: course.units || [],
    }));
  } catch (error) {
    console.error("Error searching courses:", error);
    return [];
  }
};

// Get course units
export const getCourseUnits = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/${courseId}/units`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get specific unit
export const getCourseUnit = async (courseId, unitIndex) => {
  try {
    const response = await axios.get(
      `${API_URL}/${courseId}/units/${unitIndex}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
