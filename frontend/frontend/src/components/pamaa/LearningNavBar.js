import React, { useState } from "react";
import { BookOpen, LayoutDashboard, PlusCircle, Award, Search, Bell, User, Menu, X } from "lucide-react";

function LearningNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600 flex items-center">
                <span className="text-3xl mr-1">📚</span> LearnHub
              </h1>
            </div>
          </div>

          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <ul className="flex space-x-1 font-medium">
                <li>
                  <a href="/courses" className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span>Courses</span>
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/courses/create" className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                    <span>Create</span>
                  </a>
                </li>
                <li>
                  <a href="/certificates" className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                    <Award className="w-4 h-4" />
                    <span>Certificates</span>
                  </a>
                </li>
              </ul>
              
              {/* User menu */}
              <div className="flex items-center space-x-3 ml-2 border-l border-gray-200 pl-3">
                <button className="rounded-full p-1.5 hover:bg-blue-100 transition-colors relative text-gray-600 hover:text-blue-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                <button className="flex items-center space-x-2 bg-white hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-full py-1 px-3 transition-colors shadow-sm border border-gray-100">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-blue-100 hover:text-blue-600 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-b-lg shadow-sm border-t border-gray-100">
            {/* Search on mobile */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-blue-400" />
                </div>
                <input
                  className="block w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-300 focus:ring-blue-300"
                  placeholder="Search for courses..."
                />
              </div>
            </div>
            
            <a href="/courses" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span>Courses</span>
            </a>
            
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            
            <a href="/courses/create" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
              <PlusCircle className="w-5 h-5" />
              <span>Create</span>
            </a>
            
            <a href="/certificates" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
              <Award className="w-5 h-5" />
              <span>Certificates</span>
            </a>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <div className="flex justify-between px-3 py-2">
              <button className="rounded-md bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-1.5 font-medium flex items-center gap-2 transition-colors border border-gray-100 shadow-sm">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              
              <button className="rounded-md bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-1.5 font-medium flex items-center gap-2 transition-colors border border-gray-100 shadow-sm">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default LearningNavBar;