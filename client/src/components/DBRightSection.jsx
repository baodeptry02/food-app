import React from "react";
import { DBHeader, DBNewItem } from ".";
import { Route, Routes } from "react-router-dom";

const DBRightSection = () => {
  return (
    <div className="flex flex-col py-12 px-12 flex-1 h-full border-l dark:border-l-darkOverlay-300 border-l-slate-200 transition-colors duration-500 ease-in-out">
      <DBHeader />
      <div className="flex flex-col flex-1 overflow-y-scroll scrollbar-none ">
        <Routes>
          {/* <Route path="/home" element={<DBHome />} />
          <Route path="/orders" element={<DBOrders />} />
          <Route path="/items" element={<DBItems />} /> */}
          <Route path="/newItem" element={<DBNewItem />} />
          {/* <Route path="/users" element={<DBUsers />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default DBRightSection;
