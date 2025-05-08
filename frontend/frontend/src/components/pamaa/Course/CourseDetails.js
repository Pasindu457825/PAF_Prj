import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  getCourseById,
  getCourseUnits,
  deleteCourse,
} from "../../../services/courseService";
import {
  enrollInCourse,
  findEnrollment,
} from "../../../services/enrollmentService";
import { FiDownload, FiFile, FiTag, FiBook, FiClock, FiUser, FiLayers, FiChevronRight, FiAward } from "react-icons/fi";
import Swal from "sweetalert2";
import "./Course.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const [courseData, unitsData] = await Promise.all([
          getCourseById(courseId),
          getCourseUnits(courseId),
        ]);

        if (courseData && !courseData.author) {
          courseData.author = { name: "Unknown author" };
        }

        setCourse(courseData);
        setUnits(unitsData || []);

        if (isAuthenticated && user && courseData.author) {
          setIsAuthor(user.id === courseData.author.id);
        }

        if (isAuthenticated && user) {
          try {
            const enrollment = await findEnrollment(user.id, courseId);
            if (enrollment) {
              setIsEnrolled(true);
            }
          } catch (err) {
            // Not enrolled
          }
        }
      } catch (err) {
        setError("Failed to load course details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await enrollInCourse(user.id, courseId);
      setIsEnrolled(true);
    } catch (err) {
      setError("Failed to enroll in course");
      console.error(err);
    }
  };

  const handleStartLearning = () => {
    navigate(`/courses/view/${courseId}`);
  };

  const handleDeleteCourse = async () => {
    // Use SweetAlert2 for confirmation dialog
    const result = await Swal.fire({
      title: "Delete Course",
      text: "Are you sure you want to delete this course? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    // If confirmed, proceed with deletion
    if (result.isConfirmed) {
      try {
        await deleteCourse(courseId, user.id);
        
        // Show success toast notification
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Course "${course.title}" deleted successfully`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        
        // Navigate to dashboard with state intact
        navigate("/dashboard", {
          state: {
            courseDeleted: true,
            courseTitle: course.title,
          },
        });
      } catch (err) {
        // Show error toast notification
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Failed to delete course",
          text: "Please try again later",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        
        setError("Failed to delete course");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Course Not Found</h3>
              <p className="text-yellow-700 mt-1">The course you're looking for doesn't exist or has been removed.</p>
              <Link 
                to="/courses" 
                className="mt-3 inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-200 transition"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    title = "Untitled Course",
    description = "No description available",
  } = course;

  const authorName =
    `${course.author?.firstName} ${course.author?.lastName}` ||
    "Unknown author";

  const courseUnits = Array.isArray(units) ? units : [];

  // Calculate estimated completion time based on units
  const estimatedTime = courseUnits.length * 30; // 30 minutes per unit as an example
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section with course title and primary actions */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              {course.category && (
                <div className="inline-flex items-center bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-xs font-medium mb-4">
                  <FiTag className="mr-1" />
                  <span>{course.category}</span>
                </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
              <p className="text-blue-100 mb-6 max-w-2xl line-clamp-2">
                {description.substring(0, 120)}{description.length > 120 ? '...' : ''}
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <FiUser className="mr-2 text-blue-200" />
                  <span className="text-sm">{authorName}</span>
                </div>
                <div className="flex items-center">
                  <FiLayers className="mr-2 text-blue-200" />
                  <span className="text-sm">{courseUnits.length} Units</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2 text-blue-200" />
                  <span className="text-sm">{formatTime(estimatedTime)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              {isEnrolled ? (
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={handleStartLearning}
                >
                  <FiBook className="mr-2" />
                  Continue Learning
                </button>
              ) : (
                <button 
                  className="bg-white hover:bg-blue-50 text-blue-700 py-3 px-6 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={handleEnroll}
                >
                  <FiAward className="mr-2" />
                  Enroll Now
                </button>
              )}
              
              {isAuthor && (
                <div className="flex space-x-3">
                  <Link 
                    to={`/courses/edit/${courseId}`} 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition flex-1 text-center"
                  >
                    Edit Course
                  </Link>
                  <button 
                    onClick={handleDeleteCourse} 
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-medium transition flex-1"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About this course */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this course</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            {/* Course content/units */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Content</h2>
              
              {courseUnits.length > 0 ? (
                <div className="space-y-3">
                  {courseUnits.map((unit, index) => (
                    <div 
                      key={unit.id || index} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center font-medium mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 group-hover:text-blue-700">
                              {unit.title || `Unit ${index + 1}`}
                            </h3>
                            {unit.description && (
                              <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                            )}
                          </div>
                        </div>
                        <FiChevronRight className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FiLayers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No units available for this course yet.</p>
                  {isAuthor && (
                    <Link 
                      to={`/courses/edit/${courseId}`} 
                      className="text-blue-600 hover:underline font-medium inline-flex items-center"
                    >
                      <span>Add content to your course</span>
                      <FiChevronRight className="ml-1" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Course Overview</h3>
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiLayers className="mr-2 text-blue-500" /> Units
                    </span>
                    <span className="font-medium text-gray-800">{courseUnits.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiClock className="mr-2 text-blue-500" /> Duration
                    </span>
                    <span className="font-medium text-gray-800">{formatTime(estimatedTime)}</span>
                  </div>
                  {course.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <FiTag className="mr-2 text-blue-500" /> Category
                      </span>
                      <span className="font-medium text-gray-800">{course.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FiUser className="mr-2 text-blue-500" /> Instructor
                    </span>
                    <span className="font-medium text-gray-800">{authorName}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {isEnrolled ? (
                  <button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                    onClick={handleStartLearning}
                  >
                    <FiBook className="mr-2" />
                    Continue Learning
                  </button>
                ) : (
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                    onClick={handleEnroll}
                  >
                    <FiAward className="mr-2" />
                    Enroll Now
                  </button>
                )}
              </div>
            </div>

            {/* Downloadable materials */}
            {course.pdfFileUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Course Materials</h3>
                <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <FiFile className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{course.pdfFileName || "Course Material"}</h4>
                    <p className="text-sm text-gray-500 mb-3">PDF Document</p>
                    <a
                      href={course.pdfFileUrl}
                      download={course.pdfFileName || "course-material.pdf"}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition"
                    >
                      <FiDownload className="mr-2" /> Download PDF
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Instructor card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">About the Instructor</h3>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center text-blue-600 font-bold text-lg mr-3">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{authorName}</h4>
                  {course.author?.title && <p className="text-sm text-gray-500">{course.author.title}</p>}
                </div>
              </div>
              {course.author?.bio ? (
                <p className="text-gray-700 text-sm">{course.author.bio}</p>
              ) : (
                <p className="text-gray-500 text-sm italic">No instructor bio available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;