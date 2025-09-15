import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiMedal, GiTrophy, GiDiploma } from 'react-icons/gi';
import { FiEye, FiInfo, FiCalendar, FiAward } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { AuthContext } from '../../../context/AuthContext';
import { getUserCertificates } from '../../../services/certificateService';
import './Certificate.css';

const CertificatesList = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getUserCertificates(user.id);
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setError('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const filteredCertificates = certificates.filter(cert => {
    // Filter by search term
    const matchesSearch = cert.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by date if needed
    if (filterActive === 'all') return matchesSearch;
    if (filterActive === 'recent') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return matchesSearch && new Date(cert.issueDate) >= threeMonthsAgo;
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const getRandomAccentColor = () => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCertificateIcon = (index) => {
    const icons = [<GiMedal size={28} />, <GiTrophy size={28} />, <GiDiploma size={28} />, <FiAward size={28} />];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
            <BsStars className="text-white text-4xl" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">My Achievements</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your collection of certificates and recognitions from completed courses
        </p>
      </motion.div>

      {/* Search and filter controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between px-4"
      >
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterActive('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterActive === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive('recent')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterActive === 'recent' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Recent
          </button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {filteredCertificates.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredCertificates.map((certificate, index) => (
              <motion.div 
                key={certificate.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
                variants={item}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)" 
                }}
              >
                <div className={`bg-gradient-to-r ${getRandomAccentColor()} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      {getCertificateIcon(index)}
                    </div>
                    <span className="bg-white/30 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-sm">
                      Verified
                    </span>
                  </div>
                  <h3 className="mt-6 font-bold text-xl text-white leading-snug line-clamp-2">
                    {certificate.course?.title || "This course has been deleted"}
                  </h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FiCalendar className="mr-2" />
                    <span>Issued on: {new Date(certificate.issueDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FiInfo className="mr-2" />
                    <span>Certificate ID: {certificate.certificateNumber.substring(0, 8)}...</span>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link 
                      to={`/certificates/${certificate.id}`} 
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors duration-200"
                    >
                      <FiEye size={18} /> View Certificate
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
              <GiMedal size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 mb-1">You haven't earned any certificates yet.</p>
            <p className="text-gray-500 mb-8">Complete courses to earn certificates and build your portfolio.</p>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Explore Courses
            </Link>
          </motion.div>
        )}
      </div>

      {certificates.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            Displaying {filteredCertificates.length} of {certificates.length} certificates
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CertificatesList;