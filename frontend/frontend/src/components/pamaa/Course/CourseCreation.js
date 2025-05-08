import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { createCourse } from "../../../services/courseService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Upload, 
  FilePlus, 
  FileText, 
  X, 
  PlusCircle, 
  Trash2, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  BookMarked,
  Layers,
  Layout,
  Edit3
} from "lucide-react";
import "./Course.css";

const CourseCreation = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    units: [{ title: "", content: "" }],
  });
  
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [formStage, setFormStage] = useState("details"); // details, units
  const [previewMode, setPreviewMode] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);

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
    { value: "other", label: "Other" },
  ];

// 1️⃣ Load draft from localStorage ONCE when component loads
useEffect(() => {
  const localStorageDraft = localStorage.getItem('courseCreationDraft');
  if (localStorageDraft) {
    try {
      const parsedDraft = JSON.parse(localStorageDraft);
      setFormData(parsedDraft);
    } catch (e) {
      console.error("Error parsing draft from localStorage", e);
    }
  }
}, []); // Runs only once

// 2️⃣ Save draft to localStorage every 30 seconds if there's any data
useEffect(() => {
  const interval = setInterval(() => {
    if (formData.title || formData.description || formData.units[0].title) {
      localStorage.setItem('courseCreationDraft', JSON.stringify(formData));
      setSaveAnimation(true);
      setTimeout(() => setSaveAnimation(false), 2000);
    }
  }, 30000);

  return () => clearInterval(interval);
}, [formData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUnitChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUnits = [...formData.units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      units: updatedUnits,
    });
  };

  const addUnit = () => {
    const newUnits = [...formData.units, { title: "", content: "" }];
    setFormData({
      ...formData,
      units: newUnits,
    });
    setActiveUnitIndex(newUnits.length - 1);
  };

  const removeUnit = (index) => {
    const updatedUnits = formData.units.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      units: updatedUnits,
    });
    
    if (activeUnitIndex >= updatedUnits.length) {
      setActiveUnitIndex(Math.max(0, updatedUnits.length - 1));
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is a PDF
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }

      setPdfFile(file);
      setPdfFileName(file.name);
      setError("");
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setError("Title, category, and description are required");
      return false;
    }
    
    if (formData.units.some((unit) => !unit.title.trim() || !unit.content.trim())) {
      setError("All units must have a title and content");
      return false;
    }
    
    return true;
  };

  const moveToNextStage = () => {
    if (formStage === "details") {
      if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
        setError("Please complete all required fields before proceeding");
        return;
      }
      setError("");
      setFormStage("units");
    }
  };

  const moveToPreviousStage = () => {
    if (formStage === "units") {
      setFormStage("details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Create FormData to handle file upload
      const courseFormData = new FormData();
      courseFormData.append("title", formData.title);
      courseFormData.append("category", formData.category);
      courseFormData.append("description", formData.description);
      courseFormData.append("authorId", user.id);

      // Add units as JSON string
      courseFormData.append("units", JSON.stringify(formData.units));

      // Add PDF file if present
      if (pdfFile) {
        courseFormData.append("pdfFile", pdfFile);
      }

      const newCourse = await createCourse(courseFormData);

      // Clear the draft from localStorage
      localStorage.removeItem('courseCreationDraft');

      // Navigate to dashboard with success state
      navigate("/dashboard", {
        state: {
          newCourseCreated: true,
          courseId: newCourse.id,
          courseTitle: newCourse.title,
          refreshCreatedCourses: true,
        },
      });
    } catch (error) {
      console.log("error", error);
      setError(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BookMarked className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            <AnimatePresence>
              {saveAnimation && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 text-sm flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Draft saved</span>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              type="button" 
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center"
            >
              <Layout className="w-4 h-4 mr-1.5" />
              {previewMode ? "Edit Mode" : "Preview"}
            </button>
          </motion.div>
        </div>

        {/* Progress indicator */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between">
              <div className={`flex items-center ${formStage === "details" ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                  formStage === "details" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100"
                }`}>
                  1
                </div>
                Course Details
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-1 w-full ${formStage === "details" ? "bg-gray-200" : "bg-indigo-500"}`}></div>
              </div>
              <div className={`flex items-center ${formStage === "units" ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                  formStage === "units" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100"
                }`}>
                  2
                </div>
                Course Units
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError("")} 
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {formStage === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white shadow-sm rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Edit3 className="w-5 h-5 mr-2 text-indigo-600" />
                    Course Information
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter a descriptive title for your course"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Course Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Course Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Provide a detailed description of what students will learn in this course"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Course Materials (PDF)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                      {!pdfFile ? (
                        <div className="space-y-3 text-center">
                          <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                            <Upload className="w-8 h-8" />
                          </div>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="pdfUpload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                            >
                              <span>Upload a PDF file</span>
                              <input
                                id="pdfUpload"
                                name="pdfUpload"
                                type="file"
                                ref={fileInputRef}
                                accept=".pdf"
                                onChange={handlePdfUpload}
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Optional. PDF up to 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 w-full">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1 truncate">
                            <p className="text-sm font-medium text-gray-900 truncate">{pdfFileName}</p>
                            <p className="text-xs text-gray-500">
                              {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removePdf}
                            className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={moveToNextStage}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Continue to Course Units</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {formStage === "units" && (
              <motion.div
                key="units"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-indigo-600" />
                      Course Units
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Organize your course into logical units
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex space-x-6">
                      <div className="w-64 border-r border-gray-200 pr-4">
                        <div className="mb-4 flex justify-between items-center">
                          <h3 className="font-medium text-gray-700">Units</h3>
                          <button
                            type="button"
                            onClick={addUnit}
                            className="text-indigo-600 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-50"
                            title="Add new unit"
                          >
                            <PlusCircle className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-2 max-h-96 overflow-auto pr-2">
                          {formData.units.map((unit, index) => (
                            <button
                              key={index}
                              type="button"
                              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                                activeUnitIndex === index
                                  ? "bg-indigo-100 text-indigo-700 font-medium"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                              onClick={() => setActiveUnitIndex(index)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="truncate flex-1">
                                  {unit.title ? unit.title : `Unit ${index + 1}`}
                                </div>
                                {formData.units.length > 1 && activeUnitIndex === index && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeUnit(index);
                                    }}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        <button
                          type="button"
                          onClick={addUnit}
                          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 mr-1.5" />
                          Add Unit
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeUnitIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-5"
                          >
                            <div className="space-y-1">
                              <label 
                                htmlFor={`unit-title-${activeUnitIndex}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Unit Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id={`unit-title-${activeUnitIndex}`}
                                name="title"
                                value={formData.units[activeUnitIndex].title}
                                onChange={(e) => handleUnitChange(activeUnitIndex, e)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter unit title"
                                required
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label 
                                htmlFor={`unit-content-${activeUnitIndex}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Unit Content <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                id={`unit-content-${activeUnitIndex}`}
                                name="content"
                                value={formData.units[activeUnitIndex].content}
                                onChange={(e) => handleUnitChange(activeUnitIndex, e)}
                                rows="12"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter detailed content for this unit"
                                required
                              ></textarea>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={moveToPreviousStage}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ChevronRight className="w-4 h-4 transform rotate-180" />
                    <span>Back to Course Details</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-1" />
                        <span>Create Course</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Preview Mode */}
        {previewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Layout className="w-5 h-5 mr-2 text-indigo-600" />
                Course Preview
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{formData.title || "Course Title"}</h1>
                {formData.category && (
                  <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                    {categoryOptions.find(cat => cat.value === formData.category)?.label || formData.category}
                  </div>
                )}
                <p className="text-gray-700 whitespace-pre-wrap">
                  {formData.description || "Course description will appear here..."}
                </p>
                
                {pdfFile && (
                  <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-sm text-gray-700">Additional materials: {pdfFileName}</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Content</h3>
              
              <div className="space-y-4">
                {formData.units.map((unit, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium">
                      Unit {index + 1}: {unit.title || `Untitled Unit ${index + 1}`}
                    </div>
                    <div className="p-4 text-gray-700 whitespace-pre-wrap">
                      {unit.content || "Unit content will appear here..."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCreation;