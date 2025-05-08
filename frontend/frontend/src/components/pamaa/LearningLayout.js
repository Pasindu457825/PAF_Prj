// components/pamaa/LearningLayout.js
import React from "react";
import LearningNavBar from "../pamaa/LearningNavBar";
import { Outlet } from "react-router-dom";

const LearningLayout = () => {
  return (
    <>
      <LearningNavBar />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default LearningLayout;
