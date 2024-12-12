import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { staggerFadeInOut } from '../animations';
import { IoFastFood } from 'react-icons/io5';
import { statuses } from '../utils/styles.utils';
import SliderCard from './SliderCard';
import Lottie from 'lottie-react';
import Sus from '../animations/sus.json';

const FilterSection = () => {
  const [category, setCategory] = useState('fruits');
  const [isLoading, setIsLoading] = useState(false);
  const products = useSelector((state) => state?.productState?.products);

  const handleChangeCategory = (newCategory) => {
    setIsLoading(true);
    setCategory(newCategory);
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Giả lập delay
  };

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === category),
    [products, category]
  );

  return (
    <motion.div className="w-full flex items-start justify-start flex-col bg-primary dark:bg-darkBg mb-12 transition-colors duration-500 ease-in-out">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-2xl text-headingColor font-bold">Our Hot Dishes</p>
          <div className="w-40 h-1 rounded-md bg-orange-500"></div>
        </div>
      </div>
      <div className="w-full overflow-x-scroll pt-6 flex items-center justify-center gap-6 py-8">
        {statuses &&
          statuses.map((data, i) => (
            <FilterCard
              key={i}
              data={data}
              category={category}
              setCategory={handleChangeCategory}
              index={i}
            />
          ))}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center w-full my-12">
          <Lottie className="w-32 h-32" animationData={Sus} />
        </div>
      ) : (
        <div className="w-full flex items-center justify-evenly flex-wrap gap-4 mt-12">
          {filteredProducts.map((data, i) => (
            <SliderCard key={i} data={data} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const FilterCard = ({ data, index, category, setCategory }) => {
  const handleChangeCategory = (e) => {
    setCategory(data.category);
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      onClick={handleChangeCategory}
      className={`group w-28 min-w-[128px] cursor-pointer rounded-md  py-6 ${
        category === data.category ? 'bg-red-500' : 'bg-primary'
      } hover:bg-red-500 shadow-md flex flex-col items-center justify-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center group-hover:bg-primary ${
          category === data.category ? 'bg-primary' : 'bg-red-500'
        }`}
      >
        <IoFastFood
          className={`${
            category === data.category ? 'text-red-500' : 'text-primary'
          } group-hover:text-red-500`}
        />
      </div>
      <p
        className={`text-xl font-semibold ${
          category === data.category ? 'text-primary' : 'text-textColor'
        } group-hover:text-primary`}
      >
        {data.title}
      </p>
    </motion.div>
  );
};

export default FilterSection;
