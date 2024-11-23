import React from 'react';
import { motion } from 'framer-motion';
import { FilterSection, Slider, StepProgressBar } from '../../components';

const Menu = () => {
  return (
    <motion.div className="w-full flex items-start justify-start flex-col pt-28 px-20 bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <StepProgressBar />
      <div className=" w-full flex items-center justify-between ">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">
            Our Fresh & Healthy Fruits
          </p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>

      <Slider />
      <FilterSection />
    </motion.div>
  );
};

export default Menu;
