import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCertificate } from '../../../services/certificateService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FiDownload, FiChevronLeft, FiSettings } from 'react-icons/fi';
import './Certificate.css';

const CertificateDownload = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    quality: 'high', // high or standard
    format: 'pdf', // pdf or png
    paperSize: 'a4' // a4 or letter
  });
  
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await getCertificate(certificateId);
        setCertificate(data);
      } catch (error) {
        console.error('Error fetching certificate:', error);
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setGenerating(true);
    
    try {
      // Ensure proper dimensions when capturing the certificate
      const certificateElement = certificateRef.current;
      
      // Configure canvas options based on quality setting
      const scale = downloadOptions.quality === 'high' ? 4 : 2;
      
      const canvas = await html2canvas(certificateElement, {
        scale: scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight,
        onclone: (document) => {
          // Add print-specific styles to the cloned document
          const styleEl = document.createElement('style');
          styleEl.innerHTML = `
            .certificate {
              box-shadow: none !important;
              border: none !important;
              height: 566px !important; /* Force correct height */
              overflow: hidden !important;
            }
            .certificate::before {
              box-shadow: none !important;
            }
            .certificate-content {
              overflow: visible !important;
            }
          `;
          document.head.appendChild(styleEl);
        }
      });
      
      if (downloadOptions.format === 'png') {
        // Download as PNG
        const link = document.createElement('a');
        link.download = `Certificate-${certificate.course.title}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } else {
        // Download as PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Choose PDF dimensions based on paper size setting
        let pdfWidth, pdfHeight;
        if (downloadOptions.paperSize === 'letter') {
          // US Letter size (215.9mm x 279.4mm)
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'letter'
          });
          pdfWidth = pdf.internal.pageSize.getWidth();
          pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Add image to PDF
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Certificate-${certificate.course.title}.pdf`);
        } else {
          // A4 size (210mm x 297mm)
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });
          pdfWidth = pdf.internal.pageSize.getWidth();
          pdfHeight = pdf.internal.pageSize.getHeight();
          
          // Add image to PDF
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Certificate-${certificate.course.title}.pdf`);
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setDownloadOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-indicator">Loading certificate...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!certificate) {
    return <div className="error-message">Certificate not found</div>;
  }

  const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <div className="certificate-download-container">
      <div className="certificate-title-area">
        <h1>Your Certificate of Achievement</h1>
        <p>Congratulations on completing {certificate.course.title}</p>
      </div>
      
      <div className="certificate-actions">
        <button 
          className="btn-download-certificate"
          onClick={handleDownload}
          disabled={generating}
        >
          <FiDownload size={20} />
          {generating ? 'Generating...' : 'Download Certificate'}
        </button>
        
        <button
          className="btn-download-options"
          onClick={() => setShowOptions(!showOptions)}
        >
          <FiSettings size={18} />
          Options
        </button>
        
        <Link to="/certificates" className="btn-back">
          <FiChevronLeft size={20} />
          Back to Certificates
        </Link>
      </div>
      
      {showOptions && (
        <div className="download-options-panel">
          <h3>Download Options</h3>
          <div className="options-grid">
            <div className="option-group">
              <label>Quality:</label>
              <select 
                name="quality" 
                value={downloadOptions.quality}
                onChange={handleOptionChange}
              >
                <option value="standard">Standard</option>
                <option value="high">High (Larger file)</option>
              </select>
            </div>
            
            <div className="option-group">
              <label>Format:</label>
              <select 
                name="format" 
                value={downloadOptions.format}
                onChange={handleOptionChange}
              >
                <option value="pdf">PDF Document</option>
                <option value="png">PNG Image</option>
              </select>
            </div>
            
            <div className="option-group">
              <label>Paper Size:</label>
              <select 
                name="paperSize" 
                value={downloadOptions.paperSize}
                onChange={handleOptionChange}
              >
                <option value="a4">A4 (210×297mm)</option>
                <option value="letter">US Letter (8.5×11in)</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="certificate-preview">
        <div className="certificate" ref={certificateRef}>
          <div className="certificate-border">
            <div className="certificate-header">
              <div className="certificate-gradient"></div>
              <h1>CERTIFICATE</h1>
              <p>Of Achievement</p>
            </div>
            <div className="certificate-body">
              <p className="certificate-presented">This Certificate is Proudly Presented To</p>
              <p className="certificate-name">{certificate.user.name}</p>
              <p className="certificate-description">
                For successfully completing the course <strong>{certificate.course.title}</strong>
              </p>
              <p className="certificate-date">Issued on {issueDate}</p>
            </div>
            <div className="certificate-footer">
              <div className="certificate-signatures">
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Samira Hadid</p>
                  <p>Instructor</p>
                </div>
                <div className="ribbon"></div>
                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Benjamin Shah</p>
                  <p>Program Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDownload;
