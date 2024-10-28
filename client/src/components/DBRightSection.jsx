import React from "react";
import { DBHeader } from ".";

const DBRightSection = () => {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full border-l dark:border-l-darkOverlay-300 border-l-slate-200 transition-colors duration-500 ease-in-out">
      <DBHeader />
    </div>
  );
};

export default DBRightSection;
