import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  
  // Get user from session storage
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchCourseAndEnrollmentStatus = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8080/api/courses/${id}`);
        setCourse(courseResponse.data);
        
        // Check if user is already enrolled
        if (user && user.email) {
          try {
            const enrollmentResponse = await axios.get(
              `http://localhost:8080/api/enrollments/${user.email}/${id}`
            );
            setEnrolled(enrollmentResponse.status === 200);
          } catch (err) {
            // 404 means not enrolled, which is fine
            if (err.response?.status !== 404) {
              console.error('Error checking enrollment:', err);
            }
          }
        }
        
        setError('');
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollmentStatus();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setEnrolling(true);
      await axios.post('http://localhost:8080/api/enrollments', {
        userEmail: user.email,
        courseId: id
      });
      setEnrolled(true);
      
      // Navigate to course progress page after successful enrollment
      navigate(`/learning/${id}`);
    } catch (err) {
      console.error('Failed to enroll:', err);
      setError('Failed to enroll in this course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Course Content</h2>
            {course.stages && course.stages.length > 0 ? (
              <ul className="space-y-2">
                {course.stages.map((stage, index) => (
                  <li key={index} className="flex items-center">
                    <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{stage.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No content available for this course yet.</p>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Created by: {course.creatorEmail}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            {enrolled ? (
              <button 
                onClick={() => navigate(`/learning/${id}`)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Continue Learning
              </button>
            ) : (
              <button 
                onClick={handleEnroll}
                disabled={enrolling}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                  enrolling ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
