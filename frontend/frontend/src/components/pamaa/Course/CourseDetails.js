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
import { FiDownload, FiFile, FiTag } from "react-icons/fi";
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

        // Ensure the course data has all required properties
        if (courseData && !courseData.author) {
          courseData.author = { name: "Unknown author" };
        }

        setCourse(courseData);
        setUnits(unitsData || []);

        // Check if user is the author of the course
        if (isAuthenticated && user && courseData.author) {
          setIsAuthor(user.id === courseData.author.id);
        }

        // Check if user is enrolled
        if (isAuthenticated && user) {
          try {
            const enrollment = await findEnrollment(user.id, courseId);
            if (enrollment) {
              setIsEnrolled(true);
            }
          } catch (err) {
            // Not enrolled, which is fine
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
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteCourse(courseId, user.id);
      navigate("/dashboard", {
        state: {
          courseDeleted: true,
          courseTitle: course.title,
        },
      });
    } catch (err) {
      setError("Failed to delete course");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading course details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found</div>;
  }

  // Safe access to properties with default values
  const {
    title = "Untitled Course",
    description = "No description available",
  } = course;

  // Safe access for author name
  const authorName = course.author?.name || "Unknown author";

  // Ensure units is always an array
  const courseUnits = Array.isArray(units) ? units : [];

  return (
    <div className="course-details">
      <div className="course-header">
        <h1>{title}</h1>
        <p className="course-author">Created by {authorName}</p>

        {/* Add course category display */}
        {course.category && (
          <div className="course-category">
            <FiTag className="category-icon" />
            <span>{course.category}</span>
          </div>
        )}

        {/* Add course management options for author */}
        {isAuthor && (
          <div className="course-management">
            <Link to={`/courses/edit/${courseId}`} className="btn-edit">
              Edit Course
            </Link>
            <button onClick={handleDeleteCourse} className="btn-delete">
              Delete Course
            </button>
          </div>
        )}
      </div>

      {/* PDF Materials Section */}
      {course.pdfFileUrl && (
        <div className="course-pdf-materials">
          <h2>Course Materials</h2>
          <div className="pdf-download-card">
            <div className="pdf-icon-container">
              <FiFile className="pdf-large-icon" />
            </div>
            <div className="pdf-info">
              <h3>{course.pdfFileName || "Course Material"}</h3>
              <p>PDF Document</p>
              <a
                href={course.pdfFileUrl}
                download={course.pdfFileName || "course-material.pdf"}
                className="btn-download-pdf"
              >
                <FiDownload className="mr-2" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="course-info">
        <div className="course-description">
          <h2>About this course</h2>
          <p>{description}</p>
        </div>

        <div className="course-sidebar">
          <div className="course-stats">
            <div className="stat">
              <span className="stat-label">Units</span>
              <span className="stat-value">{courseUnits.length}</span>
            </div>
            {course.category && (
              <div className="stat">
                <span className="stat-label">Category</span>
                <span className="stat-value">{course.category}</span>
              </div>
            )}
          </div>

          {isEnrolled ? (
            <button
              className="btn-start-learning"
              onClick={handleStartLearning}
            >
              Continue Learning
            </button>
          ) : (
            <button className="btn-enroll" onClick={handleEnroll}>
              Enroll Now
            </button>
          )}
        </div>
      </div>

      <div className="course-units">
        <h2>Course Content</h2>
        {courseUnits.length > 0 ? (
          <div className="units-list">
            {courseUnits.map((unit, index) => (
              <div key={unit.id || index} className="unit-item">
                <span className="unit-index">{index + 1}</span>
                <span className="unit-title">
                  {unit.title || `Unit ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No units available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
