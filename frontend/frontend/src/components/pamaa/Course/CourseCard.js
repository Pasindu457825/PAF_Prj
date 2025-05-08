import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBook, FiUser, FiClock, FiArrowRight, FiAward, FiBarChart2 } from "react-icons/fi";
import "./Course.css";

const CourseCard = ({ course, viewMode = "grid" }) => {
  // Check if course object has required properties
  if (!course) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center justify-center">
        <FiBarChart2 className="mr-2" /> Course data not available
      </div>
    );
  }

  // Extract properties with defaults to prevent errors
  const { 
    id, 
    title, 
    description = "No description available",
    thumbnail,
    createdAt,
    difficulty = "All Levels",
    category = "General" 
  } = course;

  // Safe access to nested properties
  const authorName =
    `${course.author?.firstName || ''} ${course.author?.lastName || ''}`.trim() ||
    "Unknown author";
  const unitsCount = course.units?.length || 0;
  
  // Calculate estimated time (mock data - replace with actual data if available)
  const estimatedHours = unitsCount * 2 || "N/A";
  
  // Format the date
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : "Unknown date";
    
  // Determine difficulty badge color
  const getDifficultyColor = () => {
    const diff = (difficulty || "").toLowerCase();
    if (diff.includes("beginner")) return "bg-green-100 text-green-800";
    if (diff.includes("intermediate")) return "bg-yellow-100 text-yellow-800";
    if (diff.includes("advanced")) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };
  
  // Get category color based on category name
  const getCategoryColors = () => {
    const cat = (category || "").toLowerCase();
    
    // Different color schemes for different categories
    if (cat.includes("programming") || cat.includes("coding")) 
      return { bg: "bg-indigo-100", text: "text-indigo-800", gradient: "from-indigo-400 to-blue-600" };
    if (cat.includes("design") || cat.includes("ux")) 
      return { bg: "bg-purple-100", text: "text-purple-800", gradient: "from-purple-400 to-pink-600" };
    if (cat.includes("business") || cat.includes("marketing")) 
      return { bg: "bg-blue-100", text: "text-blue-800", gradient: "from-blue-400 to-cyan-600" };
    if (cat.includes("data") || cat.includes("analytics")) 
      return { bg: "bg-teal-100", text: "text-teal-800", gradient: "from-teal-400 to-green-600" };
    if (cat.includes("language") || cat.includes("writing")) 
      return { bg: "bg-emerald-100", text: "text-emerald-800", gradient: "from-emerald-400 to-teal-600" };
    if (cat.includes("science") || cat.includes("math")) 
      return { bg: "bg-amber-100", text: "text-amber-800", gradient: "from-amber-400 to-yellow-600" };
    if (cat.includes("health") || cat.includes("fitness")) 
      return { bg: "bg-green-100", text: "text-green-800", gradient: "from-green-400 to-emerald-600" };
    if (cat.includes("art") || cat.includes("music")) 
      return { bg: "bg-rose-100", text: "text-rose-800", gradient: "from-rose-400 to-red-600" };
    if (cat.includes("photography") || cat.includes("video")) 
      return { bg: "bg-cyan-100", text: "text-cyan-800", gradient: "from-cyan-400 to-blue-600" };
    if (cat.includes("personal") || cat.includes("development")) 
      return { bg: "bg-orange-100", text: "text-orange-800", gradient: "from-orange-400 to-red-600" };
    
    // Default color scheme
    return { bg: "bg-gray-100", text: "text-gray-800", gradient: "from-gray-400 to-slate-600" };
  };
  
  const categoryColors = getCategoryColors();
  
  // Generate a placeholder color based on the category
  const getPlaceholderColor = () => {
    return categoryColors.gradient;
  };

  // List view mode
  if (viewMode === "list") {
    return (
      <motion.div 
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
        whileHover={{ translateY: -4 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="md:w-1/4 lg:w-1/5">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={title} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-br', ...getPlaceholderColor().split(' '));
                  e.target.parentElement.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                      <FiBook class="text-white text-3xl" />
                    </div>
                  `;
                }}
              />
            ) : (
              <div className={`bg-gradient-to-br ${getPlaceholderColor()} h-full min-h-32 flex items-center justify-center`}>
                <FiBook className="text-white text-3xl" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors.bg} ${categoryColors.text}`}>
                  {category}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor()}`}>
                  {difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {description.length > 180
                  ? `${description.substring(0, 180)}...`
                  : description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiUser className="mr-1" size={14} />
                  <span>{authorName}</span>
                </div>
                <div className="flex items-center">
                  <FiBook className="mr-1" size={14} />
                  <span>{unitsCount} units</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" size={14} />
                  <span>{estimatedHours} hours</span>
                </div>
              </div>
              
              <Link 
                to={`/courses/${id}`} 
                className={`inline-flex items-center justify-center bg-gradient-to-r ${categoryColors.gradient} text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium gap-1`}
              >
                View Course <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default grid view mode
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full"
      whileHover={{ translateY: -4 }}
    >
      {/* Top section with image or placeholder */}
      {thumbnail ? (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title} 
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', ...getPlaceholderColor().split(' '));
              e.target.parentElement.innerHTML = `
                <div class="flex items-center justify-center h-full">
                  <FiBook class="text-white text-4xl" />
                </div>
              `;
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-90 backdrop-blur-sm ${categoryColors.text.replace('text-', '')} shadow-sm`}>
              {category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-90 backdrop-blur-sm ${getDifficultyColor().replace('bg-', '').replace('-100', '-800')} shadow-sm`}>
              {difficulty}
            </span>
          </div>
        </div>
      ) : (
        <div className={`bg-gradient-to-br ${getPlaceholderColor()} aspect-video flex items-center justify-center relative`}>
          <FiBook className="text-white text-4xl" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-90 backdrop-blur-sm ${categoryColors.text.replace('text-', '')} shadow-sm`}>
              {category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-90 backdrop-blur-sm ${getDifficultyColor().replace('bg-', '').replace('-100', '-800')} shadow-sm`}>
              {difficulty}
            </span>
          </div>
        </div>
      )}
      
      {/* Content section */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">{title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description.length > 120
            ? `${description.substring(0, 120)}...`
            : description}
        </p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <FiUser className="mr-1" size={14} />
            <span>{authorName}</span>
          </div>
          <div className="flex items-center">
            <FiBook className="mr-1" size={14} />
            <span>{unitsCount} units</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" size={14} />
            <span>{estimatedHours} hours</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link 
            to={`/courses/${id}`} 
            className={`w-full inline-flex items-center justify-center bg-gradient-to-r ${categoryColors.gradient} text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium`}
          >
            View Course <FiArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;