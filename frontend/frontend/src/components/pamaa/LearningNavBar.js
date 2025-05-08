import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, LayoutDashboard, PlusCircle, Award } from "lucide-react";

function LearningNavBar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">LearnHub</h1>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li className="flex items-center gap-1 hover:text-blue-600">
            <BookOpen className="w-5 h-5" />
            <Link to="/courses">Courses</Link>
          </li>
          <li className="flex items-center gap-1 hover:text-blue-600">
            <LayoutDashboard className="w-5 h-5" />
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="flex items-center gap-1 hover:text-blue-600">
            <PlusCircle className="w-5 h-5" />
            <Link to="/courses/create">Create</Link>
          </li>
          <li className="flex items-center gap-1 hover:text-blue-600">
            <Award className="w-5 h-5" />
            <Link to="/certificates">Certificates</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default LearningNavBar;
