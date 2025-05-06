import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { createCourse } from "../../../services/courseService";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import "./Course.css";

const CourseCreation = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    units: [{ title: "", content: "" }],
  });
  console.log("user", user);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setFormData({
      ...formData,
      units: [...formData.units, { title: "", content: "" }],
    });
  };

  const removeUnit = (index) => {
    const updatedUnits = formData.units.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      units: updatedUnits,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      setError("Title, category, and description are required");
      setLoading(false);
      return;
    }
    if (
      formData.units.some((unit) => !unit.title.trim() || !unit.content.trim())
    ) {
      setError("All units must have a title and content");
      setLoading(false);
      return;
    }

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

      // Give the user options after creating a course
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

  return (
    <div className="course-creation">
      <h1>Create a New Course</h1>

      {error && <div className="error-message">{error}</div>}

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
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pdfUpload">Course Materials (PDF)</label>
          <div className="pdf-upload-container">
            {!pdfFile ? (
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
            ) : (
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

        <button type="button" className="btn-add-unit" onClick={addUnit}>
          Add Another Unit
        </button>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-create-course"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreation;
