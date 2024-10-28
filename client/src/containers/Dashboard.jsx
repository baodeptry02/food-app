import React from "react";
import { DBLeftSection, DBRightSection } from "../components";

const Dashboard = () => {
  return (
    <div className="w-screen h-screen flex items-center bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <DBLeftSection />
      <DBRightSection />
    </div>
  );
};

export default Dashboard;
