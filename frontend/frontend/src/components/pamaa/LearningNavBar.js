import React, { useState, useEffect } from "react";
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Award,
  Users,
  Menu,
  X,
  LogOut,
  UserCircle,
  LogIn, // ✅ add this here
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = sessionStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser(); // initial load

    window.addEventListener("storage", loadUser); // ✅ re-run on manual dispatch

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

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
      title: "Posts",
      path: "/myposts",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Certificates",
      path: "/certificates",
    },
  ];

  const renderUserSection = () => {
    if (user) {
      return (
        <div className="flex items-center gap-4 ml-6">
          {/* ✅ Make profile image clickable */}
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="Profile"
            onClick={() => navigate("/myprofile")}
            className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={() => navigate("/login")}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-6"
        >
          Login
        </button>
      );
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="ml-2 text-xl font-bold text-blue-600">
              LearnHub
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (user) {
                      navigate(item.path);
                    } else {
                      navigate("/login"); // 🔁 redirect if not logged in
                    }
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            {/* Always show login/logout section */}
            <div className="ml-6">{renderUserSection()}</div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.title}</span>
              </a>
            ))}
            <div className="mt-2">{renderUserSection()}</div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LearningNavBar;
