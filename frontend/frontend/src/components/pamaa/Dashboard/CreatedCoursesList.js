import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { deleteCourse } from '../../../services/courseService';
import './Dashboard.css';

const CreatedCoursesList = ({ createdCourses, onCourseDeleted }) => {
  // Ensure createdCourses is an array
  const coursesArray = Array.isArray(createdCourses) ? createdCourses : [];
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingCourseId, setProcessingCourseId] = useState(null);
  
  const handleDeleteCourse = async (courseId, courseTitle) => {
    // Enhanced delete confirmation message
    if (!window.confirm(`Delete Course: "${courseTitle}"\n\nThis action cannot be undone. All units and content will be permanently deleted. Are you sure you want to proceed?`)) {
      return;
    }
    
    try {
      setProcessingCourseId(courseId);
      setLoading(true);
      await deleteCourse(courseId, user.id);
      
      // Notify parent component to refresh the list
      if (onCourseDeleted) {
        onCourseDeleted(courseId);
      }
      
      setError('');
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
      setProcessingCourseId(null);
    }
  };

  const handleEditCourse = (courseId, courseTitle) => {
    // Add analytics tracking if needed
    console.log(`Editing course: ${courseTitle}`);
    navigate(`/courses/edit/${courseId}`);
  };
  
  return (
    <div className="created-courses">
      <div className="section-header">
        <h2>Courses You've Created</h2>
        <Link to="/courses/create" className="btn-create">
          Create New Course
        </Link>
      </div>
      
      <div className="section-description">
        <p>These are courses you've created. You have full edit and management access to these courses.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      {coursesArray.length > 0 ? (
        <div className="courses-grid">
          {coursesArray.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-card-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description.length > 100 
                  ? `${course.description.substring(0, 100)}...` 
                  : course.description}</p>
                <p><strong>Units:</strong> {course.units ? course.units.length : 0}</p>
              </div>
              <div className="course-management-controls">
                <div className="management-label">Manage This Course:</div>
                <div className="course-card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditCourse(course.id, course.title)}
                    aria-label={`Edit ${course.title}`}
                    title="Edit course content, title, and units"
                  >
                    <span className="action-icon">✏️</span> Edit Course
                  </button>
                  <Link 
                    to={`/courses/${course.id}`} 
                    className="btn-view"
                    aria-label={`View ${course.title}`}
                    title="View course as students will see it"
                  >
                    <span className="action-icon">👁️</span> View
                  </Link>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    disabled={loading && processingCourseId === course.id}
                    aria-label={`Delete ${course.title}`}
                    title="Permanently delete this course and all its content"
                  >
                    <span className="action-icon">🗑️</span> 
                    {loading && processingCourseId === course.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              <div className="quick-actions-hint">
                <p>Tip: Click Edit to modify course content and structure</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't created any courses yet.</p>
          <Link to="/courses/create" className="btn-primary">
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreatedCoursesList;
