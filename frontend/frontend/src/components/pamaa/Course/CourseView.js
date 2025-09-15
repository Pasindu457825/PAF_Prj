import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getCourseById, getCourseUnits } from '../../../services/courseService';
import { findEnrollment, updateProgress } from '../../../services/enrollmentService';
import { generateCertificate } from '../../../services/certificateService';
import './Course.css';

const urlPattern = /(https?:\/\/[^\s]+)/g;

const convertUrlsToLinks = (text) => {
  if (!text) return '';
  return text.split(urlPattern).map((part, i) =>
    part.match(urlPattern) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="course-content-link underline text-blue-600 hover:text-blue-800"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
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
    const fetchData = async () => {
      try {
        const [courseData, unitsData, enrollmentData] = await Promise.all([
          getCourseById(courseId),
          getCourseUnits(courseId),
          findEnrollment(user.id, courseId)
        ]);

        setCourse(courseData);
        setUnits(unitsData);
        setEnrollment(enrollmentData);

        setCurrentUnitIndex(Math.min(enrollmentData.lastCompletedUnit + 1, unitsData.length - 1));

        if (enrollmentData.completed) {
          setCompletionMessage('🎉 You have completed this course!');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [courseId, user]);

  const handleNext = async () => {
    try {
      await updateProgress(enrollment.id, { unitIndex: currentUnitIndex });
      if (currentUnitIndex < units.length - 1) {
        setCurrentUnitIndex(currentUnitIndex + 1);
      } else {
        const updated = await updateProgress(enrollment.id, { unitIndex: currentUnitIndex });
        setEnrollment(updated);
        if (updated.completed) {
          setCompletionMessage('🎉 Congratulations! You have completed this course!');
        }
      }
    } catch (error) {
      console.error('Progress update failed:', error);
      setError('Failed to update progress.');
    }
  };

  const handleGenerateCertificate = async () => {
    setGeneratingCertificate(true);
    try {
      const cert = await generateCertificate(user.id, courseId);
      navigate(`/certificates/${cert.id}`);
    } catch (error) {
      console.error('Certificate generation failed:', error);
      setError('Failed to generate certificate.');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading course content...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded my-4">{error}</div>;
  if (!course || !units.length || !enrollment) return <div className="text-center text-gray-500">Course not found or not enrolled.</div>;

  const currentUnit = units[currentUnitIndex];
  const progress = Math.round(((currentUnitIndex + 1) / units.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {currentUnitIndex + 1} of {units.length} units completed ({progress}%)
        </p>
      </div>

      {completionMessage ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-green-600 text-lg font-semibold mb-4">{completionMessage}</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
            onClick={handleGenerateCertificate}
            disabled={generatingCertificate}
          >
            {generatingCertificate ? 'Generating...' : '🎓 Get Your Certificate'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
            📘 {currentUnit.title}
          </h2>

          <div className="text-gray-700 text-[17px] leading-relaxed space-y-4 mb-6">
            {currentUnit.content.split('\n').map((p, i) => (
              <p key={i}>{convertUrlsToLinks(p)}</p>
            ))}
          </div>

          <hr className="my-6" />

          <div className="flex justify-between">
            {currentUnitIndex > 0 ? (
              <button
                onClick={() => setCurrentUnitIndex(currentUnitIndex - 1)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition"
              >
                ◀ Previous
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
            >
              {currentUnitIndex < units.length - 1 ? 'Next ▶' : '🎓 Complete Course'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
