import React from 'react';
import './Dashboard.css';

const CourseStats = ({ stats }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon">📚</div>
        <div className="stat-content">
          <h3>Total Enrollments</h3>
          <p className="stat-value">{stats.totalEnrollments}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <h3>Completed Courses</h3>
          <p className="stat-value">{stats.completedEnrollments}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🚀</div>
        <div className="stat-content">
          <h3>In Progress</h3>
          <p className="stat-value">{stats.inProgressEnrollments}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseStats;
