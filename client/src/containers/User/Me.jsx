import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import { Cart } from '../../components';
import ConfirmOrder from './ConfirmOrder';
import OrderSuccess from './OrderSuccess';

const Me = () => {
  return (
    <div className="w-screen h-full min-h-screen flex items-center bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <div className="flex flex-col py-12 px-12 flex-1 h-full border-l dark:border-l-darkOverlay-300 border-l-slate-200 transition-colors duration-500 ease-in-out">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Routes>
      </div>
    </div>
  );
};

export default Me;
