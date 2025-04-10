import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingStage, setCompletingStage] = useState(false);
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      if (!user || !user.email) {
        setError('Please log in to continue learning');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8080/api/courses/${courseId}`);
        setCourse(courseResponse.data);
        
        // Fetch enrollment details
        try {
          const enrollmentResponse = await axios.get(
            `http://localhost:8080/api/enrollments/${user.email}/${courseId}`
          );
          setEnrollment(enrollmentResponse.data);
          
          // Determine current stage based on completed stages
          if (enrollmentResponse.data.completedStages) {
            const completedStages = enrollmentResponse.data.completedStages;
            const maxCompletedStage = completedStages.length > 0 
              ? Math.max(...completedStages) 
              : -1;
            
            // Set current stage to the next one to complete
            setCurrentStageIndex(Math.min(maxCompletedStage + 1, courseResponse.data.stages.length - 1));
          }
        } catch (err) {
          // If no enrollment found, redirect to course detail page
          if (err.response?.status === 404) {
            navigate(`/courses/${courseId}`);
          } else {
            throw err;
          }
        }
        
        setError('');
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError('Failed to load course content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseAndEnrollment();
  }, [courseId, user, navigate]);
  
  const handleCompleteStage = async () => {
    if (!user || !user.email || !course || !enrollment) return;
    
    const currentStage = course.stages[currentStageIndex];
    
    try {
      setCompletingStage(true);
      
      // Mark current stage as completed
      await axios.post(
        `http://localhost:8080/api/enrollments/${user.email}/${courseId}/complete/${currentStage.order}`
      );
      
      // Refresh enrollment data to get updated completedStages
      const updatedEnrollmentResponse = await axios.get(
        `http://localhost:8080/api/enrollments/${user.email}/${courseId}`
      );
      setEnrollment(updatedEnrollmentResponse.data);
      
      // Move to next stage if available
      if (currentStageIndex < course.stages.length - 1) {
        setCurrentStageIndex(currentStageIndex + 1);
      } else if (updatedEnrollmentResponse.data.completed) {
        // If course is completed, show certificate
        navigate(`/certificates/${user.email}/${courseId}`);
      }
    } catch (err) {
      console.error('Failed to complete stage:', err);
      setError('Failed to mark stage as completed. Please try again.');
    } finally {
      setCompletingStage(false);
    }
  };
  
  const handleNextStage = () => {
    if (currentStageIndex < course.stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };
  
  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
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
  
  if (!course || !enrollment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          Course not found or you are not enrolled.
        </div>
      </div>
    );
  }
  
  // Calculate progress percentage
  const completedCount = enrollment.completedStages?.length || 0;
  const totalStages = course.stages?.length || 0;
  const progressPercentage = totalStages > 0 
    ? Math.round((completedCount / totalStages) * 100) 
    : 0;
  
  const currentStage = course.stages[currentStageIndex];
  const isStageCompleted = enrollment.completedStages?.includes(currentStage.order);
  const isLastStage = currentStageIndex === course.stages.length - 1;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/my-learning')} 
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">{progressPercentage}% Complete</span>
          <div className="w-32 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{course.title}</h1>
          <p className="text-gray-500 mb-6">Stage {currentStageIndex + 1} of {course.stages.length}</p>
          
          {/* Stage navigation tabs */}
          <div className="flex overflow-x-auto mb-6 pb-2">
            {course.stages.map((stage, index) => (
              <button
                key={index}
                onClick={() => setCurrentStageIndex(index)}
                className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 mx-1 rounded-md text-sm font-medium transition-colors ${
                  currentStageIndex === index
                    ? 'bg-blue-600 text-white'
                    : enrollment.completedStages?.includes(stage.order)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {/* Current stage content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentStage.title}</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentStage.content }}></div>
          </div>
          
          {/* Navigation and action buttons */}
          <div className="flex justify-between border-t border-gray-200 pt-4">
            <button
              onClick={handlePrevStage}
              disabled={currentStageIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentStageIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {!isStageCompleted && (
                <button
                  onClick={handleCompleteStage}
                  disabled={completingStage}
                  className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                    completingStage ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  {completingStage ? 'Marking complete...' : 'Mark as Complete'}
                </button>
              )}
              
              {!isLastStage && (
                <button
                  onClick={handleNextStage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              )}
              
              {isLastStage && enrollment.completed && (
                <button
                  onClick={() => navigate(`/certificates/${user.email}/${courseId}`)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  View Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
