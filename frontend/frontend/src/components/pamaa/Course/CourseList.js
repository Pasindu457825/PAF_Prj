import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllCourses, searchCourses } from "../../../services/courseService";
import CourseCard from "./CourseCard";
import { FiSearch, FiBookOpen, FiFilter, FiX, FiGrid, FiList } from "react-icons/fi";
import { BsStars, BsLightningCharge, BsTrophy } from "react-icons/bs";
import "./Course.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "all",
    category: "all",
    sort: "newest"
  });

  const location = useLocation();

  useEffect(() => {
    // Check if we're coming from course creation with success data
    if (location.state?.newCourseCreated) {
      setSuccessMessage(
        `Course "${location.state.courseTitle}" was successfully created!`
      );

      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        // Ensure courses data is an array
        const coursesArray = Array.isArray(data) ? data : [];
        setCourses(coursesArray);
        setFilteredCourses(coursesArray);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters state changes
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let result = [...courses];
    
    // Apply difficulty filter if not "all"
    if (filters.difficulty !== "all") {
      result = result.filter(course => 
        course.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }
    
    // Apply category filter if not "all"
    if (filters.category !== "all") {
      result = result.filter(course => 
        course.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Apply sorting
    if (filters.sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "popular") {
      result.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    } else if (filters.sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredCourses(result);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    try {
      setLoading(true);
      const results = await searchCourses(searchQuery);
      // Ensure search results data is an array
      const resultsArray = Array.isArray(results) ? results : [];
      setFilteredCourses(resultsArray);
      setError("");
    } catch (error) {
      console.error("Error searching courses:", error);
      setError("Failed to search courses. Please try again later.");
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Categories and difficulties (mock data - replace with actual data)
  const categories = ["Programming", "Design", "Business", "Marketing", "Science"];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        className="text-center max-w-4xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full shadow-lg">
            <FiBookOpen className="text-white text-4xl" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Explore Courses</h1>
        <p className="text-gray-600 text-lg">Discover courses created by our community of experts and enhance your skills</p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div 
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <form 
              className="flex-grow relative"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Search
              </button>
            </form>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiFilter size={18} />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                >
                  <FiGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Expandable Filters */}
          {filterOpen && (
            <motion.div 
              className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select 
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange("difficulty", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Levels</option>
                  {difficulties.map((diff, idx) => (
                    <option key={idx} value={diff.toLowerCase()}>{diff}</option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select 
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Featured Categories */}
      <motion.div 
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Programming', 'Design', 'Business', 'Marketing'].map((category, index) => (
            <button 
              key={index}
              onClick={() => handleFilterChange("category", category.toLowerCase())}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow text-center"
            >
              {index === 0 && <BsLightningCharge className="text-indigo-500 text-2xl mb-2" />}
              {index === 1 && <FiBookOpen className="text-purple-500 text-2xl mb-2" />}
              {index === 2 && <BsStars className="text-blue-500 text-2xl mb-2" />}
              {index === 3 && <BsTrophy className="text-green-500 text-2xl mb-2" />}
              <span className="font-medium">{category}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Success Message */}
      {successMessage && (
        <motion.div 
          className="max-w-6xl mx-auto mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-green-50 border-l-4 border-green-500 p-4 flex justify-between items-center rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
            {location.state?.courseId && (
              <Link
                to={`/courses/${location.state.courseId}`}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
              >
                View Course
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div 
          className="max-w-6xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Course List */}
      {loading ? (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
            <motion.div 
              className="max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredCourses.map((course) => (
                  <motion.div key={course.id} variants={itemVariants}>
                    <CourseCard course={course} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 text-center text-gray-500">
                Showing {filteredCourses.length} of {courses.length} courses
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="max-w-2xl mx-auto text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-6">
                  <FiSearch className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Courses Found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any courses matching your search criteria.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      difficulty: "all",
                      category: "all",
                      sort: "newest"
                    });
                    setFilteredCourses(courses);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiX className="mr-2" />
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;