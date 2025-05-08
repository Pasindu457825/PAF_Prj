import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAllCourses, searchCourses } from "../../../services/courseService";
import CourseCard from "./CourseCard";
import "./Course.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    // Check if we're coming from course creation with success data
    if (location.state?.newCourseCreated) {
      setSuccessMessage(
        `Course "${location.state.courseTitle}" was successfully created!`
      );

      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        // Ensure courses data is an array
        const coursesArray = Array.isArray(data) ? data : [];
        setCourses(coursesArray);
        setFilteredCourses(coursesArray);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    try {
      setLoading(true);
      const results = await searchCourses(searchQuery);
      // Ensure search results data is an array
      const resultsArray = Array.isArray(results) ? results : [];
      setFilteredCourses(resultsArray);
      setError("");
    } catch (error) {
      console.error("Error searching courses:", error);
      setError("Failed to search courses. Please try again later.");
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Explore Courses</h1>
        <p>Discover courses created by our community of experts</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
          {location.state?.courseId && (
            <Link
              to={`/courses/${location.state.courseId}`}
              className="view-course-link"
            >
              View Course
            </Link>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-indicator">Loading courses...</div>
      ) : (
        <>
          {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="no-courses-found">
              <p>No courses found matching your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
