import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { deleteCourse } from '../../../services/courseService';
import './Dashboard.css';
import { 
  PencilIcon, 
  EyeIcon, 
  TrashIcon, 
  PlusIcon, 
  BookOpenIcon, 
  Clock, 
  User, 
  ChevronRight,
  Calendar,
  AlertCircle
} from 'lucide-react';

const CreatedCoursesList = ({ createdCourses, onCourseDeleted }) => {
  const coursesArray = Array.isArray(createdCourses) ? createdCourses : [];
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingCourseId, setProcessingCourseId] = useState(null);
  
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Delete Course: "${courseTitle}"\n\nThis action cannot be undone. All units and content will be permanently deleted. Are you sure you want to proceed?`)) {
      return;
    }
    
    try {
      setProcessingCourseId(courseId);
      setLoading(true);
      await deleteCourse(courseId, user.id);
      
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
    console.log(`Editing course: ${courseTitle}`);
    navigate(`/courses/edit/${courseId}`);
  };

  // Helper function to generate random course stats for visual enhancement
  const getRandomStats = () => {
    return {
      students: Math.floor(Math.random() * 100),
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      duration: `${Math.floor(Math.random() * 10) + 1} hours`
    };
  };
  
  // Color themes for course cards to add variety
  const cardThemes = [
    {
      gradient: "from-blue-500 to-blue-600",
      accent: "blue-700",
      iconColor: "text-blue-500",
      hoverBorder: "hover:border-blue-300",
      deleteHover: "hover:text-red-600 hover:border-red-300 hover:bg-red-50"
    },
    {
      gradient: "from-purple-500 to-purple-600",
      accent: "purple-700",
      iconColor: "text-purple-500",
      hoverBorder: "hover:border-purple-300",
      deleteHover: "hover:text-red-600 hover:border-red-300 hover:bg-red-50"
    },
    {
      gradient: "from-green-500 to-green-600",
      accent: "green-700",
      iconColor: "text-green-500",
      hoverBorder: "hover:border-green-300",
      deleteHover: "hover:text-red-600 hover:border-red-300 hover:bg-red-50"
    },
    {
      gradient: "from-indigo-500 to-indigo-600",
      accent: "indigo-700",
      iconColor: "text-indigo-500",
      hoverBorder: "hover:border-indigo-300",
      deleteHover: "hover:text-red-600 hover:border-red-300 hover:bg-red-50"
    },
    {
      gradient: "from-teal-500 to-teal-600",
      accent: "teal-700",
      iconColor: "text-teal-500",
      hoverBorder: "hover:border-teal-300",
      deleteHover: "hover:text-red-600 hover:border-red-300 hover:bg-red-50"
    },
    {
      gradient: "from-pink-500 to-pink-600",
      accent: "pink-700",
      iconColor: "text-pink-500",
      hoverBorder: "hover:border-pink-300",
      deleteHover: "hover:text-red-600 hover:border-red-300 hover:bg-red-50"
    }
  ];
  
  // Assign a theme based on the index or course ID
  const getThemeForCourse = (index) => {
    return cardThemes[index % cardThemes.length];
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpenIcon size={28} className="text-blue-600" />
            My Courses
          </h2>
          <p className="text-gray-600 mt-2">Create, manage and track your educational content</p>
        </div>
        <Link 
          to="/courses/create" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm"
        >
          <PlusIcon size={20} />
          <span>Create New Course</span>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded flex items-center">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {coursesArray.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesArray.map((course, index) => {
            const stats = getRandomStats();
            const theme = getThemeForCourse(index);
            
            return (
              <div key={course.id} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col group bg-white">
                <div className={`bg-gradient-to-r ${theme.gradient} p-5 text-white relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${theme.accent} rounded-full opacity-20 -translate-y-6 translate-x-6`}></div>
                  <div className={`absolute bottom-0 left-0 w-16 h-16 bg-${theme.accent} rounded-full opacity-20 translate-y-6 -translate-x-6`}></div>
                  
                  <h3 className="font-bold text-xl text-white mb-1 relative z-10 pr-6 truncate">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-90 text-sm relative z-10">
                    <span className={`font-medium bg-${theme.accent} bg-opacity-30 px-2 py-1 rounded`}>
                      {course.units ? course.units.length : 0} {course.units && course.units.length === 1 ? 'Unit' : 'Units'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-grow">
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {course.description || "No description provided"}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} className={theme.iconColor} />
                      <span className="text-sm">{stats.students} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className={theme.iconColor} />
                      <span className="text-sm">{stats.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={16} className={theme.iconColor} />
                    <span>Last updated: {stats.lastUpdated}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-wrap gap-2 justify-between">
                    <Link 
                      to={`/courses/${course.id}`} 
                      className={`flex items-center gap-1 ${theme.iconColor} hover:${theme.iconColor.replace('500', '800')} text-sm font-medium transition-colors`}
                    >
                      <span>View Course</span>
                      <ChevronRight size={16} />
                    </Link>
                    
                    <div className="flex gap-2">
                      <button 
                        className={`flex items-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 ${theme.hoverBorder} text-gray-700 px-3 py-1 rounded-md text-sm transition-colors`}
                        onClick={() => handleEditCourse(course.id, course.title)}
                        aria-label={`Edit ${course.title}`}
                        title="Edit course content, title, and units"
                      >
                        <PencilIcon size={16} />
                        <span>Edit</span>
                      </button>
                      <button 
                        className={`flex items-center gap-1 bg-white border border-gray-300 ${theme.deleteHover} text-gray-700 px-3 py-1 rounded-md text-sm transition-colors`}
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        disabled={loading && processingCourseId === course.id}
                        aria-label={`Delete ${course.title}`}
                        title="Permanently delete this course and all its content"
                      >
                        <TrashIcon size={16} />
                        <span>{loading && processingCourseId === course.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-dashed border-blue-200">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <BookOpenIcon size={48} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No courses created yet</h3>
          <p className="text-gray-600 mb-8 text-center max-w-md">Start creating your first course to share your knowledge with students around the world</p>
          <Link 
            to="/courses/create" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-colors duration-200 shadow-md font-medium"
          >
            <PlusIcon size={20} />
            <span>Create Your First Course</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreatedCoursesList;