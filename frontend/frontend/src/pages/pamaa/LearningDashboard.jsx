import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LearningDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user || !user.email) {
        setError('Please log in to view your courses');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch user's enrollments
        const enrollmentsResponse = await axios.get(
          `http://localhost:8080/api/enrollments/user/${user.email}`
        );
        setEnrollments(enrollmentsResponse.data);
        
        // Fetch details for each enrolled course
        const coursesObj = {};
        for (const enrollment of enrollmentsResponse.data) {
          const courseResponse = await axios.get(
            `http://localhost:8080/api/courses/${enrollment.courseId}`
          );
          coursesObj[enrollment.courseId] = courseResponse.data;
          
          // Fetch progress for this enrollment
          const progressResponse = await axios.get(
            `http://localhost:8080/api/enrollments/${user.email}/${enrollment.courseId}/progress`
          );
          enrollment.progress = progressResponse.data.progress;
        }
        
        setCourses(coursesObj);
        setError('');
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
        setError('Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-4">
          Please log in to view your courses.
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Learning</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {enrollments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            You haven't enrolled in any courses yet
          </h2>
          <p className="text-gray-600 mb-6">Browse our catalog to find courses that interest you.</p>
          <Link 
            to="/courses" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enrollment => {
            const course = courses[enrollment.courseId];
            if (!course) return null;
            
            return (
              <div key={enrollment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                  
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-600">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Status and actions */}
                  <div className="flex justify-between items-center">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      enrollment.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {enrollment.completed ? 'Completed' : 'In Progress'}
                    </span>
                    
                    {enrollment.completed ? (
                      <Link 
                        to={`/certificates/${user.email}/${enrollment.courseId}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Certificate
                      </Link>
                    ) : (
                      <Link 
                        to={`/learning/${enrollment.courseId}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Continue
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LearningDashboard;
