import React, { useState } from 'react';
import { HiCurrencyRupee } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { IoBasket } from 'react-icons/io5';
import { addToCart } from '../api/cartApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addProductToCart } from '../context/actions/cartAction';

const SliderCard = ({ data, index }) => {
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const sendToCart = async () => {
    try {
      const userId = user.uid;
      const productId = data.id;
      const cartItem = {
        itemName: data.itemName,
        price: data.price,
        quantity: 1,
        img: data.imageDownloadUrl,
        id: productId,
      };
      dispatch(addProductToCart(cartItem));
      toast.success('Item added to cart successfully');
      await addToCart(cartItem, userId, productId);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="h-44 mb-4 bg-lightOverlay transition-colors duration-500 ease-in-out dark:bg-darkOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3">
      <div>
        <img
          src={data.imageDownloadUrl}
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
          alt=""
        />
      </div>
      <div className="relative pt-12">
        <p className="text-xl text-headingColor font-semibold min-h-[56px]">
          {data.itemName}
        </p>
        <p className="text-lg font-semibold text-red-500 flex items-center justify-center gap-1">
          <HiCurrencyRupee className="text-red-500" />{' '}
          {parseFloat(data.price).toFixed(2)}
        </p>

        <motion.div
          {...buttonClick}
          onClick={sendToCart}
          className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 right-2 cursor-pointer"
        >
          <IoBasket className="text-2xl text-primary" />
        </motion.div>
      </div>
    </div>
  );
};

export default SliderCard;
