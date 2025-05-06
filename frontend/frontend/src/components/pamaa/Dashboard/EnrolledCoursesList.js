import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const EnrolledCoursesList = ({ enrolledCourses, certificates }) => {
  // Create a map of course IDs to certificates for easy lookup
  const certificateMap = certificates.reduce((map, cert) => {
    map[cert?.course?.id] = cert;
    return map;
  }, {});

  return (
    <div className="enrolled-courses">
      <h2>Your Enrolled Courses</h2>

      {enrolledCourses.length > 0 ? (
        <div className="courses-grid">
          {enrolledCourses.map((enrollment) => {
            const course = enrollment.course;
            const hasCertificate = certificateMap.hasOwnProperty(course?.id);
            const totalUnits = course?.units ? course?.units.length : 0;
            const completedUnits = enrollment.lastCompletedUnit + 1;
            const progressPercentage =
              totalUnits > 0
                ? Math.min(Math.round((completedUnits / totalUnits) * 100), 100)
                : 0;

            return (
              <div key={enrollment.id} className="course-card">
                <div className="course-card-content">
                  <h3>{course?.title}</h3>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                    <span className="progress-text">
                      {progressPercentage}% Complete
                    </span>
                  </div>
                  <p className="units-progress">
                    Completed {completedUnits} of {totalUnits} units
                  </p>
                </div>
                <div className="course-card-actions">
                  {enrollment.completed ? (
                    hasCertificate ? (
                      <Link
                        to={`/certificates/${certificateMap[course?.id]?.id}`}
                        className="btn-certificate"
                      >
                        View Certificate
                      </Link>
                    ) : (
                      <Link
                        to={`/courses/view/${course?.id}`}
                        className="btn-generate-certificate"
                      >
                        Get Certificate
                      </Link>
                    )
                  ) : (
                    <Link
                      to={`/courses/view/${course?.id}`}
                      className="btn-continue"
                    >
                      Continue Learning
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnrolledCoursesList;
