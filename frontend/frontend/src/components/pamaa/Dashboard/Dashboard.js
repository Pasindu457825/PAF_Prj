import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import { getCoursesByAuthor } from "../../../services/courseService";
import {
  getUserEnrollments,
  getUserEnrollmentStats,
} from "../../../services/enrollmentService";
import { getUserCertificates } from "../../../services/certificateService";
import CreatedCoursesList from "./CreatedCoursesList";
import EnrolledCoursesList from "./EnrolledCoursesList";
import CourseStats from "../Dashboard/CourseStats";
import { FiX } from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [createdCourses, setCreatedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completedEnrollments: 0,
    inProgressEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrolled");
  const [successMessage, setSuccessMessage] = useState("");

  // Check if we're coming from course creation with a new course
  useEffect(() => {
    if (location.state?.newCourseCreated) {
      setSuccessMessage(
        `Course "${location.state.courseTitle}" was successfully created!`
      );
      setActiveTab("created"); // Automatically switch to Created Courses tab

      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Check if we're coming from course update with updated course
  useEffect(() => {
    if (location.state?.courseUpdated) {
      setSuccessMessage(
        `Course "${location.state.courseTitle}" was successfully updated!`
      );
      setActiveTab("created"); // Automatically switch to Created Courses tab

      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Use useCallback to memoize the fetchDashboardData function
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel
      const [coursesData, enrollmentsData, statsData, certificatesData] =
        await Promise.all([
          getCoursesByAuthor(user.id),
          getUserEnrollments(user.id),
          getUserEnrollmentStats(user.id),
          getUserCertificates(user.id),
        ]);

      // Ensure all data is properly formatted as arrays
      setCreatedCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrolledCourses(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      setStats(
        statsData || {
          totalEnrollments: 0,
          completedEnrollments: 0,
          inProgressEnrollments: 0,
        }
      );
      setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Initialize with empty arrays in case of error
      setCreatedCourses([]);
      setEnrolledCourses([]);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Refresh data when coming from course creation
  useEffect(() => {
    if (location.state?.refreshCreatedCourses && user) {
      fetchDashboardData();
    }
  }, [location.state?.refreshCreatedCourses, user, fetchDashboardData]);

  // Add a course deletion handler
  const handleCourseDeleted = (deletedCourseId) => {
    // Remove the deleted course from the state
    setCreatedCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== deletedCourseId)
    );

    // Show success message
    setSuccessMessage("Course was successfully deleted!");

    // Clear the success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-loading flex justify-center items-center min-h-screen">
        <div className="loader">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="ml-3 text-lg text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="dashboard container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        variants={itemVariants}
      >
        Welcome, {user.firstName}!
      </motion.h1>

      {successMessage && (
        <motion.div
          className="success-message bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-700 hover:text-green-900"
          >
            <FiX />
          </button>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <CourseStats stats={stats} />
      </motion.div>

      <motion.div
        className="dashboard-tabs bg-white rounded-lg p-2 flex mb-6 shadow-sm"
        variants={itemVariants}
      >
        <button
          className={`tab-button ${
            activeTab === "enrolled"
              ? "active bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          } flex-1 py-2 px-4 rounded-md transition-colors`}
          onClick={() => setActiveTab("enrolled")}
        >
          Enrolled Courses ({enrolledCourses.length})
        </button>
        <button
          className={`tab-button ${
            activeTab === "created"
              ? "active bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          } flex-1 py-2 px-4 rounded-md transition-colors`}
          onClick={() => setActiveTab("created")}
        >
          Created Courses ({createdCourses.length})
        </button>
        <button
          className={`tab-button ${
            activeTab === "certificates"
              ? "active bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          } flex-1 py-2 px-4 rounded-md transition-colors`}
          onClick={() => setActiveTab("certificates")}
        >
          Certificates ({certificates.length})
        </button>
      </motion.div>

      <motion.div
        className="dashboard-content bg-white rounded-lg shadow-md p-6"
        variants={itemVariants}
      >
        {activeTab === "enrolled" && (
          <EnrolledCoursesList
            enrolledCourses={enrolledCourses}
            certificates={certificates}
          />
        )}

        {activeTab === "created" && (
          <CreatedCoursesList
            createdCourses={createdCourses}
            onCourseDeleted={handleCourseDeleted}
          />
        )}

        {activeTab === "certificates" && (
          <div className="certificates-section">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Certificates
            </h2>
            {certificates.length > 0 ? (
              <div className="certificates-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <motion.div
                    key={certificate.id}
                    className="certificate-card bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-200"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {certificate.course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Issued on:{" "}
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                    <a
                      href={`/certificates/${certificate.id}`}
                      className="btn-download inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      View Certificate
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state bg-gray-50 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p className="text-gray-600 mb-4">
                  You haven't earned any certificates yet. Complete courses to
                  earn certificates!
                </p>
                <a
                  href="/courses"
                  className="btn-primary inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Browse Courses
                </a>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
