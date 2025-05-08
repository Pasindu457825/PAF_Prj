// components/pamaa/LearningLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import LearningNavBar from "../pamaa/LearningNavBar";

const LearningLayout = () => {
  return (
    <>
      <LearningNavBar /> {/* ✅ Always displayed */}
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default LearningLayout;
