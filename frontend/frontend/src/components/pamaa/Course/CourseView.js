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

// Enhanced celebration components
const Fireworks = ({ intensity = 'full' }) => {
  const [fireworks, setFireworks] = useState([]);
  const [confetti, setConfetti] = useState([]);
  
  useEffect(() => {
    // Set number of fireworks based on intensity
    const fireworksPerBatch = intensity === 'full' ? 5 : 2;
    const interval = intensity === 'full' ? 500 : 1000;
    const duration = intensity === 'full' ? 8000 : 4000;
    
    // Create initial fireworks and confetti
    createFireworks(fireworksPerBatch);
    createConfetti(intensity === 'full' ? 100 : 40);
    
    // Add more fireworks at interval
    const fireworksInterval = setInterval(() => {
      createFireworks(fireworksPerBatch);
    }, interval);
    
    // Cleanup after duration
    const timeout = setTimeout(() => {
      clearInterval(fireworksInterval);
    }, duration);
    
    return () => {
      clearInterval(fireworksInterval);
      clearTimeout(timeout);
    };
  }, [intensity]);
  
  const createFireworks = (count) => {
    const newFireworks = [...fireworks];
    
    // Create new fireworks with random positions
    for (let i = 0; i < count; i++) {
      const id = Math.random().toString(36).substring(2, 9);
      const x = Math.random() * 100;
      const y = Math.random() * 80 + 5; // Cover more vertical space
      const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      const size = Math.random() * 2.5 + 0.8;
      const duration = Math.random() * 500 + 800; // Vary the explosion time
      
      newFireworks.push({ id, x, y, color, size, duration });
      
      // Remove this firework after animation completes
      setTimeout(() => {
        setFireworks(current => current.filter(fw => fw.id !== id));
      }, duration + 100);
    }
    
    setFireworks(newFireworks);
  };
  
  const createConfetti = (count) => {
    const newConfetti = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    
    for (let i = 0; i < count; i++) {
      const id = Math.random().toString(36).substring(2, 9);
      const x = Math.random() * 100;
      const delay = Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 0.5 + 0.2;
      const duration = Math.random() * 2 + 4;
      
      newConfetti.push({ id, x, delay, color, size, duration });
    }
    
    setConfetti(newConfetti);
  };
  
  return (
    <div className="celebration-container" style={{ 
      position: 'fixed', // Use fixed instead of absolute for full page coverage
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 999, // Higher z-index to cover everything
      background: intensity === 'full' ? 'rgba(0,0,0,0.2)' : 'transparent' // Subtle overlay for full mode
    }}>
      {/* Fireworks */}
      {fireworks.map(fw => (
        <div 
          key={fw.id}
          className="firework"
          style={{
            position: 'absolute',
            left: `${fw.x}%`,
            top: `${fw.y}%`,
            width: `${fw.size}rem`,
            height: `${fw.size}rem`,
            borderRadius: '50%',
            backgroundColor: fw.color,
            boxShadow: `0 0 ${fw.size * 3}px ${fw.size * 1.5}px ${fw.color}`,
            animation: `explode ${fw.duration}ms ease-out forwards`
          }}
        />
      ))}
      
      {/* Confetti */}
      {confetti.map(c => (
        <div 
          key={c.id}
          className="confetti"
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: '-5%',
            width: `${c.size}rem`,
            height: `${c.size * 0.4}rem`,
            backgroundColor: c.color,
            opacity: 0.9,
            borderRadius: '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${c.duration}s ease-in forwards ${c.delay}s`
          }}
        />
      ))}
      
      {/* Animated congratulations text for full mode */}
      {intensity === 'full' && (
        <div className="celebration-text"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s infinite',
            opacity: 0.9,
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <h2 style={{ 
            fontSize: '3rem', 
            color: '#fff', 
            textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.8)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            CONGRATULATIONS!
          </h2>
        </div>
      )}
      
      <style jsx>{`
        @keyframes explode {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Milestone achievement component
const MilestoneAchievement = ({ message }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="milestone-achievement" style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 900,
      animation: 'slideUp 0.5s ease-out, fadeOut 0.5s ease-in 4.5s forwards',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <span style={{ fontSize: '2rem' }}>🏆</span>
      <div>
        <h3 style={{ fontWeight: 'bold', margin: 0 }}>Achievement Unlocked!</h3>
        <p style={{ margin: '0.2rem 0 0 0' }}>{message}</p>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
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
  const [showFireworks, setShowFireworks] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState('');
  const [courseInteractions, setCourseInteractions] = useState({
    halfwayReached: false,
    lastCelebrated: -1
  });

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
        // Move to next unit
        const nextIndex = currentUnitIndex + 1;
        setCurrentUnitIndex(nextIndex);
        
        // Check for milestone achievements
        const halfwayPoint = Math.floor(units.length / 2);
        
        // Celebrate each 25% progress milestone
        const quarterPoints = [
          Math.floor(units.length * 0.25),
          Math.floor(units.length * 0.5),
          Math.floor(units.length * 0.75)
        ];
        
        if (quarterPoints.includes(nextIndex) && courseInteractions.lastCelebrated !== nextIndex) {
          // Calculate progress percentage
          const progressPercent = Math.round(((nextIndex + 1) / units.length) * 100);
          
          // Different messages for different milestones
          let message;
          if (nextIndex === quarterPoints[0]) {
            message = `${progressPercent}% Complete! You're making great progress!`;
          } else if (nextIndex === quarterPoints[1]) {
            message = `Halfway there! ${progressPercent}% of the course mastered!`;
            setCourseInteractions(prev => ({ ...prev, halfwayReached: true }));
          } else if (nextIndex === quarterPoints[2]) {
            message = `${progressPercent}% Complete! The finish line is in sight!`;
          }
          
          setMilestoneMessage(message);
          setShowMilestone(true);
          setCourseInteractions(prev => ({ ...prev, lastCelebrated: nextIndex }));
          
          // Show mini celebration if halfway
          if (nextIndex === quarterPoints[1]) {
            setShowFireworks(true);
            
            // Hide fireworks after 4 seconds for milestone
            setTimeout(() => {
              setShowFireworks(false);
            }, 4000);
          }
          
          // Hide milestone notification after 5 seconds
          setTimeout(() => {
            setShowMilestone(false);
          }, 5000);
        }
      } else {
        // Course completed
        const updated = await updateProgress(enrollment.id, { unitIndex: currentUnitIndex });
        setEnrollment(updated);
        if (updated.completed) {
          setCompletionMessage('🎉 Congratulations! You have completed this course!');
          setShowFireworks(true);
          
          // Create confetti animation for full course completion
          const container = document.createElement('div');
          document.body.appendChild(container);
          
          // Hide fireworks after 8 seconds for full completion
          setTimeout(() => {
            setShowFireworks(false);
          }, 8000);
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
    <div className="max-w-4xl mx-auto px-6 py-10 relative">
      {showFireworks && <Fireworks intensity={completionMessage ? 'full' : 'mild'} />}
      {showMilestone && <MilestoneAchievement message={milestoneMessage} />}
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Quarter point markers */}
          {[25, 50, 75].map((quarter) => (
            <div 
              key={quarter}
              className="absolute top-0 w-0.5 h-3 bg-white opacity-70 z-10"
              style={{ 
                left: `${quarter}%`,
                boxShadow: quarter === 50 ? '0 0 5px 2px rgba(255,255,255,0.5)' : 'none'
              }}
            />
          ))}
          
          {/* Milestone icon for halfway point */}
          {progress >= 50 && courseInteractions.halfwayReached && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-yellow-400 rounded-full shadow-lg z-20 transform -translate-x-1/2"
              style={{ 
                left: '50%',
                animation: 'pulse 2s infinite',
                border: '2px solid white'
              }}
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">🏆</span>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-600">
            {currentUnitIndex + 1} of {units.length} units completed
          </p>
          <p className="text-sm font-semibold" style={{ color: progress >= 75 ? '#16a34a' : progress >= 50 ? '#ca8a04' : '#2563eb' }}>
            {progress}% Complete
          </p>
        </div>
      </div>

      {completionMessage ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center relative">
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