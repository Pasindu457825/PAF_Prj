import React from "react";
import { BookOpen, Award, ChevronRight, Clock, GraduationCap, AlertCircle, Layers, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EnrolledCoursesList = ({ enrolledCourses, certificates }) => {
  // Create a map of course IDs to certificates for easy lookup
  const certificateMap = certificates.reduce((map, cert) => {
    map[cert?.course?.id] = cert;
    return map;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 my-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="text-blue-600" size={28} />
            Your Learning Journey
          </h2>
          <p className="text-gray-600 mt-2">Track your progress and continue where you left off</p>
        </div>
        <Link 
          to="/courses" 
          className="text-blue-600 hover:text-blue-800 flex items-center font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Explore more courses <ChevronRight className="ml-1" />
        </Link>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((enrollment) => {
            const course = enrollment.course;
            const hasCertificate = certificateMap.hasOwnProperty(course?.id);
            const totalUnits = course?.units ? course?.units.length : 0;
            const completedUnits = enrollment.lastCompletedUnit + 1;
            const progressPercentage =
              totalUnits > 0
                ? Math.min(Math.round((completedUnits / totalUnits) * 100), 100)
                : 0;
            
            // Determine status class based on progress
            const getStatusClasses = () => {
              if (progressPercentage === 100) {
                return {
                  bg: "bg-green-500",
                  lightBg: "bg-green-50",
                  borderColor: "border-green-200",
                  textColor: "text-green-700",
                  hoverBg: "hover:bg-green-100"
                };
              } else if (progressPercentage >= 70) {
                return {
                  bg: "bg-blue-500",
                  lightBg: "bg-blue-50",
                  borderColor: "border-blue-200",
                  textColor: "text-blue-700",
                  hoverBg: "hover:bg-blue-100"
                };
              } else if (progressPercentage >= 30) {
                return {
                  bg: "bg-yellow-500",
                  lightBg: "bg-yellow-50",
                  borderColor: "border-yellow-200",
                  textColor: "text-yellow-700",
                  hoverBg: "hover:bg-yellow-100"
                };
              } else {
                return {
                  bg: "bg-orange-500",
                  lightBg: "bg-orange-50",
                  borderColor: "border-orange-200",
                  textColor: "text-orange-700",
                  hoverBg: "hover:bg-orange-100"
                };
              }
            };
            
            const statusClasses = getStatusClasses();

            return (
              <div 
                key={enrollment.id} 
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Color bar on top based on progress with subtle gradient */}
                <div className="h-2 bg-gray-100 w-full">
                  <div 
                    className={`h-full ${statusClasses.bg} bg-gradient-to-r from-current to-current/90`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="p-6 flex-grow">
                  {/* Course Title */}
                  <h3 className="font-bold text-lg mb-3 text-gray-800 line-clamp-2">
                    {course?.title || "Deleted Course"}
                  </h3>
                  
                  {/* Status Badge */}
                  <div className="flex items-center mb-4">
                    <span 
                      className={`${statusClasses.lightBg} ${statusClasses.textColor} ${statusClasses.borderColor} text-sm font-medium px-3 py-1 rounded-full border flex items-center gap-1`}
                    >
                      {progressPercentage === 100 ? (
                        <>
                          <CheckCircle size={14} />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          <span>In progress</span>
                        </>
                      )}
                    </span>
                    
                    {/* Visually separated percentage */}
                    <span className="ml-auto font-bold text-lg">
                      {progressPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-100 rounded-full mb-5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${statusClasses.bg} bg-gradient-to-r from-current to-current/80`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Units Completed Info */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-blue-500" />
                      <span className="font-medium">
                        {completedUnits} of {totalUnits} units completed
                      </span>
                    </div>
                  </div>
                  
                  {/* Time Estimate */}
                  <div className="flex items-center text-sm text-gray-500 mb-5">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span>
                      {progressPercentage < 100 ? 
                        `Estimated ${Math.ceil((totalUnits - completedUnits) * 0.5)} hours to complete` : 
                        'Course completed'}
                    </span>
                  </div>
                </div>

                {/* Action Area */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  {!course?.title ? (
                    <div className="flex items-center text-red-500 gap-2 justify-center p-2">
                      <AlertCircle size={16} />
                      <p className="text-sm font-medium">This course has been deleted</p>
                    </div>
                  ) : enrollment.completed ? (
                    hasCertificate ? (
                      <Link
                        to={`/certificates/${certificateMap[course?.id]?.id}`}
                        className={`flex items-center justify-center w-full py-2 px-4 ${statusClasses.lightBg} ${statusClasses.textColor} rounded-lg border ${statusClasses.borderColor} font-medium ${statusClasses.hoverBg} transition-colors`}
                      >
                        <Award size={18} className="mr-2" /> View Certificate
                      </Link>
                    ) : (
                      <Link
                        to={`/courses/view/${course?.id}`}
                        className="flex items-center justify-center w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Award size={18} className="mr-2" /> Get Certificate
                      </Link>
                    )
                  ) : (
                    <Link
                      to={`/courses/view/${course?.id}`}
                      className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue Learning <ChevronRight className="ml-2" size={18} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-10 text-center border border-dashed border-blue-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-6">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">No Enrolled Courses</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Start your learning journey by exploring our catalog of courses designed to help you grow professionally.</p>
          <Link 
            to="/courses" 
            className="py-3 px-8 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center shadow-sm"
          >
            Browse Courses <ChevronRight className="ml-2" size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesList;