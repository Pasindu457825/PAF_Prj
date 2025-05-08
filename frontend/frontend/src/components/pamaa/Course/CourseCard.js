import React from "react";
import { Link } from "react-router-dom";
import "./Course.css";

const CourseCard = ({ course }) => {
  // Check if course object has required properties
  if (!course) {
    return <div className="course-card error">Course data not available</div>;
  }

  // Extract properties with defaults to prevent errors
  const { id, title, description = "No description available" } = course;

  // Safe access to nested properties
  const authorName =
    `${course.author?.firstName} ${course.author?.lastName}` ||
    "Unknown author";
  const unitsCount = course.units?.length || 0;

  return (
    <div className="course-card">
      <div className="course-card-header">
        <h3>{title}</h3>
      </div>
      <div className="course-card-body">
        <p>
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
        <div className="course-meta">
          <span className="units-count">{unitsCount} units</span>
          <span className="author">By {authorName}</span>
        </div>
      </div>
      <div className="course-card-footer">
        <Link to={`/courses/${id}`} className="btn-view-course">
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
