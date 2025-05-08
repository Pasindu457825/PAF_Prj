import React, { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Award,
  Users,
  Menu,
  X,
} from "lucide-react";

const LearningNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Groups",
      path: "/groups/view",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Courses",
      path: "/courses",
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <PlusCircle className="w-5 h-5" />,
      title: "Create",
      path: "/courses/create",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Certificates",
      path: "/certificates",
    },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="ml-2 text-xl font-bold text-blue-600">
                LearnHub
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-blue-50"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LearningNavBar;
