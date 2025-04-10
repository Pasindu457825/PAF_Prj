import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {course.stages?.length || 0} stages
          </span>
          <Link 
            to={`/courses/${course.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
