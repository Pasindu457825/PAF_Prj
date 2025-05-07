import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getCertificate } from "../../../services/certificateService";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { 
  Download, 
  ChevronLeft, 
  Settings, 
  Share2, 
  X, 
  Check, 
  AlertCircle, 
  Award,
  FileType,
  Maximize
} from "lucide-react";

const CertificateDownload = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null); // "success", "error", null
  const [downloadOptions, setDownloadOptions] = useState({
    quality: "high",
    format: "pdf",
    paperSize: "a4",
  });

  const certificateRef = useRef(null);
  const optionsPanelRef = useRef(null);

  // Close options panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsPanelRef.current && !optionsPanelRef.current.contains(event.target) && 
          !event.target.closest('.btn-download-options')) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await getCertificate(certificateId);
        setCertificate(data);
      } catch (error) {
        console.error("Error fetching certificate:", error);
        setError("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && fullscreen) {
        setFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen]);

  // Auto-hide download status after 3 seconds
  useEffect(() => {
    if (downloadStatus) {
      const timer = setTimeout(() => {
        setDownloadStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [downloadStatus]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    setGenerating(true);
    setDownloadStatus(null);
    
    try {
      const certificateElement = certificateRef.current;
      const scale = downloadOptions.quality === "high" ? 4 : 2;

      const canvas = await html2canvas(certificateElement, {
        scale: scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        imageTimeout: 0,
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight,
        onclone: (document) => {
          const styleEl = document.createElement("style");
          styleEl.innerHTML = `
            .certificate {
              box-shadow: none !important;
              border: none !important;
              height: 566px !important;
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
        },
      });

      const titleSafe = certificate?.course?.title 
        ? certificate.course.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
        : "untitled-course";

      if (downloadOptions.format === "png") {
        const link = document.createElement("a");
        link.download = `Certificate-${titleSafe}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      } else {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        let pdfWidth, pdfHeight;
        const format = downloadOptions.paperSize === "letter" ? "letter" : "a4";

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format,
        });

        pdfWidth = pdf.internal.pageSize.getWidth();
        pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate-${titleSafe}.pdf`);
      }
      
      setDownloadStatus("success");
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError("Failed to generate certificate");
      setDownloadStatus("error");
    } finally {
      setGenerating(false);
    }
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setDownloadOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShareCertificate = () => {
    // Share functionality would be implemented here
    // For now just copy the URL to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Certificate link copied to clipboard!");
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading your certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-800 mb-2">Certificate Error</h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <Link 
            to="/certificates" 
            className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-center text-gray-800 mb-2">Certificate Not Found</h1>
          <p className="text-center text-gray-600 mb-6">We couldn't find the certificate you're looking for.</p>
          <Link 
            to="/certificates" 
            className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Certificates
          </Link>
        </div>
      </div>
    );
  }

  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown Issue Date";

  return (
    <div className={`relative flex flex-col ${fullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'min-h-screen'}`}>
      {/* Status notifications */}
      {downloadStatus && (
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
            downloadStatus === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {downloadStatus === "success" ? (
            <>
              <Check size={20} />
              <span>Certificate downloaded successfully!</span>
            </>
          ) : (
            <>
              <AlertCircle size={20} />
              <span>Failed to download certificate</span>
            </>
          )}
          <button 
            onClick={() => setDownloadStatus(null)}
            className="ml-2 p-1 rounded-full hover:bg-white/20"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header section with title and actions */}
      {!fullscreen && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Certificate of Achievement</h1>
                <p className="text-gray-600 mt-1">
                  Congratulations on completing{" "}
                  <span className="font-medium">{certificate.course?.title || "Untitled Course"}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Link 
                  to="/certificates" 
                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Back</span>
                </Link>
                
                <div className="relative">
                  <button
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => setShowOptions(!showOptions)}
                    aria-expanded={showOptions}
                  >
                    <Settings size={18} />
                    <span className="hidden sm:inline">Options</span>
                  </button>
                  
                  {showOptions && (
                    <div 
                      ref={optionsPanelRef}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FileType size={18} className="mr-2" />
                          Download Options
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quality
                            </label>
                            <select
                              name="quality"
                              value={downloadOptions.quality}
                              onChange={handleOptionChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="standard">Standard</option>
                              <option value="high">High (Larger file)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Format
                            </label>
                            <select
                              name="format"
                              value={downloadOptions.format}
                              onChange={handleOptionChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pdf">PDF Document</option>
                              <option value="png">PNG Image</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Paper Size
                            </label>
                            <select
                              name="paperSize"
                              value={downloadOptions.paperSize}
                              onChange={handleOptionChange}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="a4">A4 (210×297mm)</option>
                              <option value="letter">US Letter (8.5×11in)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleShareCertificate}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>
                
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ${
                    generating ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  <Download size={18} />
                  <span>{generating ? "Generating..." : "Download"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate preview area */}
      <div className={`flex-1 flex items-center justify-center p-4 sm:p-8 ${fullscreen ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`relative ${fullscreen ? 'scale-100 w-full max-w-5xl' : 'max-w-4xl w-full'}`}>
          {/* Fullscreen toggle button */}
          <button
            onClick={toggleFullscreen}
            className={`absolute -top-4 -right-4 z-10 p-2 rounded-full shadow-lg ${
              fullscreen ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
            }`}
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <Maximize size={20} />
          </button>

          {/* Certificate design */}
          <div 
            ref={certificateRef} 
            className={`certificate-container w-full aspect-[1.414/1] rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 ${
              fullscreen ? 'scale-100' : 'hover:scale-[1.01]'
            }`}
          >
            <div className="certificate-frame w-full h-full bg-white relative p-8 sm:p-12">
              {/* Border decoration */}
              <div className="absolute inset-0 border-[16px] border-double border-blue-100 m-4"></div>
              <div className="absolute inset-0 border-[1px] border-gray-300 m-2"></div>
              
              {/* Header section */}
              <div className="relative z-10 pt-6 text-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 border-4 border-white shadow-lg">
                    <Award size={36} className="text-white" />
                  </div>
                </div>
                
                <div className="mt-8">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-800">CERTIFICATE</h1>
                  <p className="text-xl text-blue-600 font-medium uppercase tracking-wider mt-1">Of Achievement</p>
                </div>
                
                <div className="w-full max-w-xs mx-auto mt-4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
              
              {/* Certificate body */}
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-600">This Certificate is Proudly Presented To</p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-4 mb-2">
                  {certificate.user?.firstName || "First Name"}{" "}
                  {certificate.user?.lastName || "Last Name"}
                </h2>
                
                <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-6">
                  For successfully completing the course
                  <span className="block text-xl sm:text-2xl font-semibold text-blue-800 mt-2">
                    {certificate.course?.title || "Untitled Course"}
                  </span>
                </p>
                
                <p className="text-lg text-gray-600 mt-8">Issued on {issueDate}</p>
              </div>
              
              {/* Footer with signatures */}
              <div className="absolute bottom-12 left-12 right-12">
                <div className="flex justify-between items-end">
                  <div className="flex-1 text-center">
                    <div className="w-full h-px bg-gray-400 mb-2"></div>
                    <p className="font-medium text-gray-800">Samira Hadid</p>
                    <p className="text-sm text-gray-600">Instructor</p>
                  </div>
                  
                  <div className="mx-8 relative">
                    <div className="w-20 h-20 rounded-full border-2 border-blue-200 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <div className="text-xs text-blue-800 font-medium uppercase tracking-wider">Verified</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center">
                    <div className="w-full h-px bg-gray-400 mb-2"></div>
                    <p className="font-medium text-gray-800">Benjamin Shah</p>
                    <p className="text-sm text-gray-600">Program Director</p>
                  </div>
                </div>
              </div>
              
              {/* Background elements */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50 to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-blue-50 to-transparent opacity-70"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-blue-100 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-2 border-blue-100 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen controls */}
      {fullscreen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <button
            onClick={() => setFullscreen(false)}
            className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <X size={20} />
            <span>Exit</span>
          </button>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Download size={20} />
            <span>{generating ? "Generating..." : "Download"}</span>
          </button>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <button
            onClick={handleShareCertificate}
            className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateDownload;