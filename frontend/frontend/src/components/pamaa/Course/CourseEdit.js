import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getCourseById, getCourseUnits, updateCourse } from '../../../services/courseService';
import { FiUpload, FiFile, FiX, FiDownload } from 'react-icons/fi';
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
    return <div className="loading-indicator">Loading course data...</div>;
  }
  
  return (
    <div className="course-edit">
      <div className="edit-breadcrumbs">
        <Link to="/dashboard">Dashboard</Link> {' > '} 
        <span>Edit Course: {originalTitle}</span>
      </div>

      <h1>Edit Course</h1>
      
      <div className="edit-instructions">
        <p>Make your changes below and click "Update Course" when done.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Course Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="category-select"
            required
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="pdfUpload">Course Materials (PDF)</label>
          <div className="pdf-upload-container">
            {existingPdf ? (
              <div className="pdf-preview">
                <FiFile className="pdf-icon" />
                <span className="pdf-filename">{existingPdf.name}</span>
                <a 
                  href={existingPdf.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="download-pdf-btn"
                  title="Download PDF"
                >
                  <FiDownload />
                </a>
                <button 
                  type="button" 
                  className="remove-pdf-btn"
                  onClick={removePdf}
                  title="Remove PDF"
                >
                  <FiX />
                </button>
              </div>
            ) : pdfFile ? (
              <div className="pdf-preview">
                <FiFile className="pdf-icon" />
                <span className="pdf-filename">{pdfFileName}</span>
                <button 
                  type="button" 
                  className="remove-pdf-btn"
                  onClick={removePdf}
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="pdfUpload"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="pdf-input"
                />
                <label htmlFor="pdfUpload" className="pdf-upload-label">
                  <FiUpload className="upload-icon" />
                  <span>Choose PDF file</span>
                </label>
                <p className="pdf-hint">Optional. Max size: 10MB</p>
              </>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Course Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        
        <h2>Course Units</h2>
        
        {formData.units.map((unit, index) => (
          <div key={index} className="unit-container">
            <h3>Unit {index + 1}</h3>
            
            <div className="form-group">
              <label htmlFor={`unit-title-${index}`}>Unit Title</label>
              <input
                type="text"
                id={`unit-title-${index}`}
                name="title"
                value={unit.title}
                onChange={(e) => handleUnitChange(index, e)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`unit-content-${index}`}>Unit Content</label>
              <textarea
                id={`unit-content-${index}`}
                name="content"
                value={unit.content}
                onChange={(e) => handleUnitChange(index, e)}
                rows="6"
                required
              ></textarea>
            </div>
            
            {formData.units.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-unit"
                onClick={() => removeUnit(index)}
              >
                Remove Unit
              </button>
            )}
          </div>
        ))}
        
        <button 
          type="button" 
          className="btn-add-unit"
          onClick={addUnit}
        >
          Add Another Unit
        </button>
        
        <div className="form-actions">
          <Link to="/dashboard" className="btn-cancel">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn-update-course"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEdit;
