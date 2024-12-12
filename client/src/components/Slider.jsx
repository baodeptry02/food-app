import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assests/css/swiperStyles.css';
import 'swiper/css/bundle';
import 'swiper/css';

import { useSelector } from 'react-redux';
import { SliderCard } from '.';

const Slider = () => {
  const products = useSelector((state) => state?.productState?.products);
  const [fruits, setFruits] = useState(null);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      setFruits(products.filter((product) => product.category === 'fruits'));
    } else {
      console.error('Products is not an array or is undefined');
    }
  }, [products]);

  return (
    <div className="w-full pt-12">
      <Swiper
        slidesPerView={4}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1.2,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          800: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1500: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1600: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
          1800: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        className="swiper"
      >
        {fruits &&
          fruits.map((data, i) => (
            <SwiperSlide key={i}>
              <SliderCard key={i} data={data} index={i} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Slider;
