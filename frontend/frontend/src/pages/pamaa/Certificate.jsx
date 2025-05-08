import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Certificate = () => {
  const { userEmail, courseId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  useEffect(() => {
    const fetchCertificateAndCourse = async () => {
      if (!user || user.email !== userEmail) {
        setError('You do not have permission to view this certificate');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch certificate
        const certificateResponse = await axios.get(
          `http://localhost:8080/api/certificates/${userEmail}/${courseId}`
        );
        setCertificate(certificateResponse.data);
        
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8080/api/courses/${courseId}`);
        setCourse(courseResponse.data);
        
        setError('');
      } catch (err) {
        console.error('Failed to fetch certificate:', err);
        
        if (err.response?.status === 404) {
          setError('Certificate not found. You may not have completed this course yet.');
        } else {
          setError('Failed to load certificate. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificateAndCourse();
  }, [userEmail, courseId, user]);
  
  const handleDownload = async () => {
    if (!certificate || !certificate.id) return;
    
    try {
      setDownloading(true);
      
      const response = await axios.get(
        `http://localhost:8080/api/certificates/download/${certificate.id}`,
        { responseType: 'blob' }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${course.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download certificate:', err);
      setError('Failed to download certificate. Please try again later.');
    } finally {
      setDownloading(false);
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
        <button 
          onClick={() => navigate('/my-learning')} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  if (!certificate || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">
          Certificate not found.
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/my-learning')} 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <div className="mb-6">
            <span className="inline-block p-3 bg-green-100 text-green-800 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
          <p className="text-gray-600 mb-6">This certifies that</p>
          
          <p className="text-2xl font-semibold text-blue-600 mb-2">{user.firstName} {user.lastName}</p>
          <p className="text-gray-600 mb-6">has successfully completed the course</p>
          
          <p className="text-2xl font-bold text-gray-800 mb-6">{course.title}</p>
          
          <p className="text-gray-600 mb-8">
            Issued on {new Date(certificate.issueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              downloading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {downloading ? 'Downloading...' : 'Download Certificate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
