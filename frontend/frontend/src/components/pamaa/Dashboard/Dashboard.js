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
  GraduationCap,
  Bell,
  Settings,
  Clock,
  Calendar,
  Zap,
  Star,
  TrendingUp
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

  // Enhanced loading animation with particle effects
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Multiple pulsing circles with different timings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 bg-indigo-500 rounded-full opacity-20"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
            
            {/* Particles floating around */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-blue-500"
                initial={{
                  x: Math.random() * 60 - 30,
                  y: Math.random() * 60 - 30,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 80 - 40,
                  y: Math.random() * 80 - 40,
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            
            {/* Main icon with glow effect */}
            <div className="absolute inset-0 flex justify-center items-center">
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30" />
                <BookIcon className="w-12 h-12 text-indigo-600 relative z-10" />
              </motion.div>
            </div>
          </div>
          <motion.p
            className="text-xl font-medium text-indigo-800"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading your dashboard...
          </motion.p>
          <motion.p
            className="text-md text-indigo-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Preparing your learning journey
          </motion.p>
        </div>
      </div>
    );
  }

  // Format current date for header
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate some quick stats for user greeting card
  const inProgressCount = enrolledCourses.filter(
    course => course.progress > 0 && course.progress < 100
  ).length;
  
  const completedCount = enrolledCourses.filter(
    course => course.progress === 100
  ).length;

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User greeting and date card */}
        <motion.div 
          className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-8 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="white" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.8,-0.7C87.6,14.9,82.7,29.8,74.9,43.5C67.1,57.2,56.4,69.7,42.7,77.7C28.9,85.7,14.5,89.1,-0.3,89.6C-15.1,90.1,-30.1,87.6,-43.9,81.1C-57.8,74.5,-70.4,63.8,-79.1,50C-87.8,36.2,-92.6,18.1,-93.2,-0.3C-93.8,-18.8,-90.3,-37.6,-81.2,-53C-72.1,-68.4,-57.5,-80.3,-41.8,-86.4C-26.1,-92.5,-9.2,-92.9,3.9,-89.1C17,-85.3,34,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-blue-100">{currentDate}</p>
                </div>
                <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="text-white text-sm">Your learning status</div>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-200 mr-2" />
                      <span className="text-white font-medium">{stats.inProgressEnrollments} In progress</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-200 mr-2" />
                      <span className="text-white font-medium">{stats.completedEnrollments} Completed</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <a href="/courses" className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium transition-all hover:bg-opacity-90 shadow-sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Explore new courses
                </a>
                <a href="/profile" className="inline-flex items-center px-4 py-2 bg-indigo-700 bg-opacity-30 text-white rounded-lg font-medium transition-all hover:bg-opacity-40 border border-white/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Account settings
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm flex justify-between items-center"
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
          <div className="bg-white rounded-xl shadow-sm p-2 flex">
            <button
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === "enrolled"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("enrolled")}
            >
              <BookOpen className="w-5 h-5" />
              <span>My Learning ({enrolledCourses.length})</span>
            </button>
            <button
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === "created"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("created")}
            >
              <Users className="w-5 h-5" />
              <span>My Courses ({createdCourses.length})</span>
            </button>
            <button
              className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === "certificates"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
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
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-indigo-600" />
                        Your Achievements
                      </h2>
                      <p className="text-gray-600 mt-1">Certificates you've earned by completing courses</p>
                    </div>
                    {certificates.length > 0 && (
                      <div className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4 mr-1" />
                        {certificates.length} {certificates.length === 1 ? 'Certificate' : 'Certificates'} Earned
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {certificates.map((certificate) => (
                        <motion.div
                          key={certificate.id}
                          className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md"
                          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(79, 70, 229, 0.15)", transition: { duration: 0.2 } }}
                        >
                          <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                          <div className="p-6 relative">
                            <div className="absolute top-4 right-4 flex items-center">
                              <Award className="w-8 h-8 text-indigo-600 opacity-30" />
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-3">
                              {certificate.course?.title || "This course has been deleted"}
                            </h3>
                            <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                            </div>
                            <a
                              href={`/certificates/${certificate.id}`}
                              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg transition-all w-full mt-2 shadow-sm"
                            >
                              <Award className="w-4 h-4" />
                              <span>View Certificate</span>
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                        <Award size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No certificates yet</h3>
                      <p className="text-gray-500 mb-6 text-center max-w-md">
                        Complete your enrolled courses to earn certificates of achievement
                      </p>
                      <a
                        href="/courses"
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm"
                      >
                        <BookOpen size={18} />
                        <span>Browse Courses</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Dashboard;