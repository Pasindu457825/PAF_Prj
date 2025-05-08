import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getCourseById, getCourseUnits, updateCourse } from '../../../services/courseService';
import { FiUpload, FiFile, FiX, FiDownload, FiArrowLeft, FiCheck, FiAlertTriangle, FiPlus, FiTrash2, FiChevronRight, FiInfo } from 'react-icons/fi';
import './Course.css';

const CourseEdit = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    units: []
  });
  
  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdf, setExistingPdf] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [replacePdf, setReplacePdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  
  const categoryOptions = [
    { value: "", label: "Select a category" },
    { value: "programming", label: "Programming & Development" },
    { value: "design", label: "Design & Creative" },
    { value: "business", label: "Business & Entrepreneurship" },
    { value: "marketing", label: "Marketing & Communications" },
    { value: "lifestyle", label: "Lifestyle & Personal Development" },
    { value: "education", label: "Education & Teaching" },
    { value: "technology", label: "Technology & Software" },
    { value: "science", label: "Science & Engineering" },
    { value: "health", label: "Health & Wellness" },
    { value: "other", label: "Other" }
  ];
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseData, unitsData] = await Promise.all([
          getCourseById(courseId),
          getCourseUnits(courseId)
        ]);
        
        setOriginalTitle(courseData.title);
        
        // If course has a PDF file
        if (courseData.pdfFileUrl) {
          setExistingPdf({
            url: courseData.pdfFileUrl,
            name: courseData.pdfFileName || 'course-material.pdf'
          });
          setPdfFileName(courseData.pdfFileName || 'course-material.pdf');
        }
        
        setFormData({
          title: courseData.title,
          category: courseData.category || '',
          description: courseData.description,
          units: unitsData.map(unit => ({
            id: unit.id,
            title: unit.title,
            content: unit.content
          }))
        });
      } catch (error) {
        setError('Failed to load course data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId, user.id, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleUnitChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUnits = [...formData.units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      [name]: value
    };
    
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const addUnit = () => {
    setFormData({
      ...formData,
      units: [...formData.units, { title: '', content: '' }]
    });
  };
  
  const removeUnit = (index) => {
    const updatedUnits = formData.units.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      setPdfFile(file);
      setPdfFileName(file.name);
      setReplacePdf(true);
      setError('');
    }
  };
  
  const removePdf = () => {
    if (existingPdf) {
      // If removing existing PDF
      setExistingPdf(null);
      setPdfFileName('');
      setReplacePdf(true);
    } else {
      // If removing newly uploaded PDF
      setPdfFile(null);
      setPdfFileName('');
      setReplacePdf(false);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');
    
    // Validate
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setError('Title, category, and description are required');
      setUpdating(false);
      return;
    }
    
    if (formData.units.some(unit => !unit.title.trim() || !unit.content.trim())) {
      setError('All units must have a title and content');
      setUpdating(false);
      return;
    }
    
    try {
      // Create FormData to handle file upload
      const courseFormData = new FormData();
      courseFormData.append('title', formData.title);
      courseFormData.append('category', formData.category);
      courseFormData.append('description', formData.description);
      courseFormData.append('requestedByUserId', user.id);
      
      // Add units as JSON string
      courseFormData.append('units', JSON.stringify(formData.units));
      
      // Add PDF file if present
      if (pdfFile) {
        courseFormData.append('pdfFile', pdfFile);
      }
      
      // Indicate if we're replacing or removing the PDF
      courseFormData.append('replacePdf', replacePdf.toString());
      
      await updateCourse(courseId, courseFormData);
      setSuccess(`"${formData.title}" has been successfully updated!`);
      
      // Give the user time to see the success message before redirecting
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            courseUpdated: true,
            courseTitle: formData.title
          } 
        });
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update course');
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-600 font-medium">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center text-blue-100 hover:text-white transition mb-2"
              >
                <FiArrowLeft className="mr-2" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">Edit Course: {originalTitle}</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Make your changes below and click "Update Course" when done. All fields marked with * are required.
              </p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Course Information</h2>
              <p className="text-sm text-gray-500">Basic information about your course</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    Provide a detailed description of what students will learn in this course.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Materials */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Course Materials</h2>
              <p className="text-sm text-gray-500">Optional: Upload a PDF with additional materials</p>
            </div>
            
            <div className="p-6">
              <div className="pdf-upload-container">
                {existingPdf ? (
                  <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <FiFile className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="block font-medium text-gray-700">{existingPdf.name}</span>
                      <span className="text-sm text-gray-500">PDF Document</span>
                    </div>
                    <div className="flex space-x-2">
                      <a 
                        href={existingPdf.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:bg-blue-100"
                        title="Download PDF"
                      >
                        <FiDownload className="h-5 w-5" />
                      </a>
                      <button 
                        type="button" 
                        className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-100"
                        onClick={removePdf}
                        title="Remove PDF"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : pdfFile ? (
                  <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <FiFile className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="block font-medium text-gray-700">{pdfFileName}</span>
                      <span className="text-sm text-gray-500">PDF Document</span>
                    </div>
                    <button 
                      type="button" 
                      className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-100"
                      onClick={removePdf}
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="pdfUpload"
                      ref={fileInputRef}
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                    <div className="mb-3">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    </div>
                    <label htmlFor="pdfUpload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-700">
                        Click to upload a PDF file
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF up to 10MB
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiUpload className="mr-2 h-4 w-4" />
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Course Units */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Course Units</h2>
              <p className="text-sm text-gray-500">Organize your course into learning units</p>
            </div>
            
            <div className="p-6 space-y-6">
              {formData.units.map((unit, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {formData.units.length > 1 && (
                      <button 
                        type="button" 
                        className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-100"
                        onClick={() => removeUnit(index)}
                        title="Remove Unit"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center font-medium mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Unit {index + 1}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor={`unit-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Title *
                      </label>
                      <input
                        type="text"
                        id={`unit-title-${index}`}
                        name="title"
                        value={unit.title}
                        onChange={(e) => handleUnitChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`unit-content-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Content *
                      </label>
                      <textarea
                        id={`unit-content-${index}`}
                        name="content"
                        value={unit.content}
                        onChange={(e) => handleUnitChange(index, e)}
                        rows="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                className="inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={addUnit}
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Another Unit
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            
            <button 
              type="submit" 
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updating}
            >
              {updating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2 h-4 w-4" />
                  Update Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEdit;