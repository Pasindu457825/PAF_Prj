import React from "react";
import { Link } from "react-router-dom";

function LearningNavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/courses/create">Create Course</Link></li> {/* Create Course Button */}
        <li><Link to="/certificates">Certificates</Link></li>
      </ul>
    </nav>
  );
}

export default LearningNavBar;
