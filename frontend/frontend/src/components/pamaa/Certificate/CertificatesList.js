import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiMedal } from 'react-icons/gi';
import { FiEye, FiInfo } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';
import { getUserCertificates } from '../../../services/certificateService';
import './Certificate.css';

const CertificatesList = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div className="loading-indicator">Loading certificates...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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

  return (
    <div className="certificates-list-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Certificates</h1>
        <p className="text-gray-600">Your achievements from completed courses</p>
      </motion.div>

      {certificates.length > 0 ? (
        <motion.div 
          className="certificates-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {certificates.map(certificate => (
            <motion.div 
              key={certificate.id} 
              className="certificate-card"
              variants={item}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)" 
              }}
            >
              <div className="certificate-card-header">
                <GiMedal size={24} className="text-gold mb-2" />
                <h3>
                  {certificate.course?.title || "This course has been deleted"}
                </h3>
              </div>

              <div className="certificate-card-body">
                <p>
                  Issued on:{" "}
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-1 text-gray-500 mt-2">
                  <FiInfo size={16} />
                  Certificate ID: {certificate.certificateNumber.substring(0, 8)}...
                </p>
              </div>

              <motion.div 
                className="certificate-card-footer"
                whileHover={{ backgroundColor: "#f0f7ff" }}
              >
                <Link 
                  to={`/certificates/${certificate.id}`} 
                  className="btn-view-certificate"
                >
                  <FiEye size={16} /> View Certificate
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GiMedal size={64} className="text-gray-400 mb-4" />
          <p>You haven't earned any certificates yet.</p>
          <p>Complete courses to earn certificates!</p>
          <Link to="/dashboard" className="btn-primary mt-4">
            Go to Dashboard
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default CertificatesList;
