import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getCourseById, getCourseUnits } from '../../../services/courseService';
import { findEnrollment, updateProgress } from '../../../services/enrollmentService';
import { generateCertificate } from '../../../services/certificateService';
import './Course.css';

// URL detection regex pattern - matches common URL formats
const urlPattern = /(https?:\/\/[^\s]+)/g;

// Function to convert plain text URLs to clickable links
const convertUrlsToLinks = (text) => {
  if (!text) return '';
  return text.split(urlPattern).map((part, i) => {
    // Check if this part matches our URL pattern
    if (part.match(urlPattern)) {
      return (
        <a 
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="course-content-link"
        >
          {part}
        </a>
      );
    }
    // Return regular text
    return part;
  });
};

const CourseView = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completionMessage, setCompletionMessage] = useState('');
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        // Get course details, units, and enrollment data
        const [courseData, unitsData, enrollmentData] = await Promise.all([
          getCourseById(courseId),
          getCourseUnits(courseId),
          findEnrollment(user.id, courseId)
        ]);
        
        setCourse(courseData);
        setUnits(unitsData);
        setEnrollment(enrollmentData);
        
        // Set current unit to last completed unit + 1, or 0 if none completed
        setCurrentUnitIndex(Math.min(enrollmentData.lastCompletedUnit + 1, unitsData.length - 1));
        
        // Check if already completed
        if (enrollmentData.completed) {
          setCompletionMessage('You have completed this course!');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourseAndEnrollment();
    }
  }, [courseId, user]);

  const handleNext = async () => {
    if (currentUnitIndex < units.length - 1) {
      // Update progress
      try {
        await updateProgress(enrollment.id, { unitIndex: currentUnitIndex });
        // Move to next unit
        setCurrentUnitIndex(currentUnitIndex + 1);
      } catch (error) {
        console.error('Error updating progress:', error);
        setError('Failed to update progress.');
      }
    } else {
      // This is the last unit, complete the course
      try {
        const updatedEnrollment = await updateProgress(enrollment.id, { unitIndex: currentUnitIndex });
        setEnrollment(updatedEnrollment);
        
        // Show completion message
        if (updatedEnrollment.completed) {
          setCompletionMessage('Congratulations! You have completed this course!');
        }
      } catch (error) {
        console.error('Error completing course:', error);
        setError('Failed to complete course.');
      }
    }
  };

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    try {
      const certificate = await generateCertificate(user.id, courseId);
      navigate(`/certificates/${certificate.id}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      setError('Failed to generate certificate.');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  if (loading) {
    return <div className="loading-indicator">Loading course content...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course || !units.length || !enrollment) {
    return <div className="error-message">Course not found or not enrolled</div>;
  }

  const currentUnit = units[currentUnitIndex];
  const progress = Math.round(((currentUnitIndex + 1) / units.length) * 100);

  return (
    <div className="course-view">
      <div className="course-view-header">
        <h1>{course.title}</h1>
        <div className="course-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {currentUnitIndex + 1} of {units.length} units completed ({progress}%)
          </span>
        </div>
      </div>
      
      {completionMessage ? (
        <div className="course-completion">
          <div className="completion-message">{completionMessage}</div>
          <button 
            className="btn-generate-certificate"
            onClick={handleGenerateCertificate}
            disabled={generatingCertificate}
          >
            {generatingCertificate ? 'Generating...' : 'Get Your Certificate'}
          </button>
        </div>
      ) : (
        <div className="unit-content">
          <h2>{currentUnit.title}</h2>
          <div className="unit-text">
            {currentUnit.content.split('\n').map((paragraph, index) => (
              <p key={index}>{convertUrlsToLinks(paragraph)}</p>
            ))}
          </div>
          
          <div className="unit-navigation">
            {currentUnitIndex > 0 && (
              <button 
                className="btn-prev"
                onClick={() => setCurrentUnitIndex(currentUnitIndex - 1)}
              >
                Previous
              </button>
            )}
            
            <button 
              className="btn-next"
              onClick={handleNext}
            >
              {currentUnitIndex < units.length - 1 ? 'Next' : 'Complete Course'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
