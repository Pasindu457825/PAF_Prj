import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  BookOpen, 
  Award, 
  Layers, 
  CheckCircle, 
  X,
  BookOpen as BookIcon,
  Users,
  GraduationCap
} from "lucide-react";

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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Enhanced loading animation
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {/* Pulsing circles */}
            <motion.div
              className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-indigo-500 rounded-full opacity-20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            
            {/* Rotating icon */}
            <motion.div
              className="flex justify-center items-center h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <BookIcon className="w-8 h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            className="text-lg font-medium text-gray-700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading your dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-8 flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.firstName}!
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="mb-8">
        <CourseStats stats={stats} />
      </motion.div>

      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <div className="bg-white rounded-lg shadow-sm p-1.5 flex">
          <button
            className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              activeTab === "enrolled"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("enrolled")}
          >
            <BookOpen className="w-5 h-5" />
            <span>My Learning ({enrolledCourses.length})</span>
          </button>
          <button
            className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              activeTab === "created"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("created")}
          >
            <Users className="w-5 h-5" />
            <span>My Courses ({createdCourses.length})</span>
          </button>
          <button
            className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              activeTab === "certificates"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("certificates")}
          >
            <Award className="w-5 h-5" />
            <span>Certificates ({certificates.length})</span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Achievements</h2>
                  <p className="text-gray-600 mt-1">Certificates you've earned by completing courses</p>
                </div>
              </div>
              
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => (
                    <motion.div
                      key={certificate.id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 transition-all hover:shadow-md"
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <div className="p-5 relative">
                        <Award className="w-8 h-8 text-blue-600 absolute top-4 right-4 opacity-20" />
                        <h3 className="font-semibold text-lg text-gray-800 mb-3">
                          {certificate.course?.title || "This course has been deleted"}
                        </h3>
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <a
                          href={`/certificates/${certificate.id}`}
                          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors w-full mt-2"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Certificate</span>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Award size={48} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No certificates yet</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    Complete your enrolled courses to earn certificates of achievement
                  </p>
                  <a
                    href="/courses"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    <BookOpen size={18} />
                    <span>Browse Courses</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;