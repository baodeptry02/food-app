import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import StepProgressBar from './ProgressBar';
import { VietQR, ZaloPay } from '../assests';
import { BiTrash } from 'react-icons/bi';
import {
  addProductToCart,
  removeSelectedItems,
  setSelectedProducts,
} from '../context/actions/cartAction';
import { addToCart, removeCartItem } from '../api/cartApi';
import { Empty, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

const Cart = () => {
  const cart = useSelector((state) => state?.cartState?.cartItems);
  const user = useSelector((state) => state?.userState?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const productRefs = useRef([]);
  const containerLeft = useRef(null);
  const container = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonBack = useRef(null);
  const workerRef = useRef(null);
  useEffect(() => {
    workerRef.current = new Worker(new URL('./cartWorker.js', import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { type, data, message } = event.data;
      if (type === 'success') {
        return;
      } else if (type === 'error') {
        console.error('Worker Error:', message);
      } else if (type === 'apiResponse') {
        console.log('API response:', data);
      }
    };
    return () => {
      workerRef.current.terminate();
    };
  }, [dispatch]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
    if (selectedItemId) {
      await handleRemove(selectedItemId);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // GSAP animation on mount
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      buttonBack.current,
      { opacity: 0, x: -200 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      }
    );
    if (productRefs.current.length > 0) {
      tl.fromTo(
        containerLeft.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
        }
      );
      tl.fromTo(
        productRefs.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.4,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      container.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
      }
    );
    tl.fromTo(
      container?.current?.querySelectorAll('h2, p, span, button'),
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.3,
        ease: 'power3.out',
      }
    );
  }, []);

  // Toggle selected item
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Calculate total price of selected items
  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) =>
        selectedItems.includes(item.id)
          ? total + item.price * item.quantity
          : total,
      0
    );
  };

  const updateQuantity = async (id, action) => {
    const cartItem = cart.find((item) => item.id === id);
    if (!cartItem) {
      console.error('Item not found in cart');
      return;
    }

    const newQuantity = action === 'increment' ? 1 : -1;

    dispatch(
      addProductToCart({
        ...cartItem,
        quantity: newQuantity,
      })
    );
    workerRef.current.postMessage({
      type: 'updateQuantity',
      payload: { id, action, cart, userId: user.uid },
    });
  };
  const decreaseQuantity = async (id, action) => {
    const cartItem = cart.find((item) => item.id === id);
    if (!cartItem) {
      console.error('Item not found in cart');
      return;
    }

    if (cartItem.quantity === 1 && action === 'decrement') {
      setSelectedItemId(id);
      setSelectedItemName(cartItem.itemName);
      showModal();
    } else {
      // Giảm số lượng bình thường
      await updateQuantity(id, action);
    }
  };

  const totalCartPrice = calculateTotalPrice();

  const handleRemove = async (id) => {
    try {
      setLoading(true);
      const userId = user.uid;
      const cartItem = cart.find((item) => item.id === id);
      if (!cartItem) {
        return;
      }
      dispatch(removeSelectedItems([id]));
      await removeCartItem(userId, id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      const selectedProducts = cart.filter((item) =>
        selectedItems.includes(item.id)
      );
      dispatch(setSelectedProducts(selectedProducts));
      navigate('/me/confirm-order', { state: { selectedProducts } });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
        <div className="p-4">
          <StepProgressBar />
        </div>
        <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-primaryColor">
            No items selected
          </h1>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your cart is empty"
          />
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-2 bg-primaryColor text-white rounded-lg"
            >
              Go to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      {/* Thanh tiến trình nằm ở trên cùng */}
      <div className="p-4">
        <StepProgressBar />
      </div>
      <Modal
        title="Are you sure you want to remove this item?"
        open={isModalOpen}
        onOk={() => handleOk(selectedItemId)}
        onCancel={handleCancel}
        className="my-auto"
      >
        <p className="pt-2 text-base text-primaryColor font-semibold">
          {selectedItemName}
        </p>
      </Modal>
      <div className=" w-full xl:px-60 px-40 mx-auto pb-4">
        <button
          ref={buttonBack}
          className=" cursor-pointer flex items-center gap-2 bg-primaryColor hover:bg-red-600 px-4 py-2 text-lg text-white font-semibold rounded-full"
          onClick={() => navigate('/menu')}
        >
          <IoIosArrowRoundBack />
          <span>Back</span>
        </button>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-6 p-8 pt-4 xl:px-60 px-40">
        <div
          ref={containerLeft}
          className="w-full lg:w-2/3 bg-white dark:bg-darkSecondary p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-bold my-4">Your Order</h2>
          <hr />
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border-b dark:border-darkBg"
                ref={(el) => (productRefs.current[index] = el)}
              >
                <input
                  type="checkbox"
                  className="mr-4 w-5 h-5 cursor-pointer"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                />

                {/* Hình ảnh sản phẩm */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md hover:scale-125 transition-transform duration-500 ease-in-out"
                />

                {/* Tên và thông tin sản phẩm */}
                <div className="flex flex-col w-[40%] ml-4">
                  <h3 className="text-lg font-semibold">{item.itemName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.price}₫ / product
                  </p>
                </div>

                {/* Điều chỉnh số lượng */}
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => {
                      decreaseQuantity(item.id, 'decrement');
                    }}
                  >
                    -
                  </button>
                  <p className="text-center w-6">{item.quantity}</p>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => updateQuantity(item.id, 'increment')}
                    disabled={loading} // Vô hiệu hóa khi đang loading
                  >
                    +
                  </button>
                </div>

                {/* Tổng tiền sản phẩm */}
                <p className="text-sm font-bold text-primaryColor px-4 w-20">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>

                {/* Biểu tượng thùng rác để xóa sản phẩm */}
                <button
                  className="text-headingColor hover:text-red-700 text-xl"
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setSelectedItemName(item.itemName);
                    showModal();
                  }}
                >
                  <BiTrash />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng trống.</p>
          )}
        </div>

        {/* Bên phải: Tổng tiền */}
        <div
          ref={container}
          className="w-full lg:w-[30%] max-h-64 h-auto bg-white dark:bg-darkSecondary p-6 rounded-lg shadow relative lg:sticky lg:top-16"
        >
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <p className="text-lg font-semibold">
            Total items price:{' '}
            <span className="text-headingColor">
              {totalCartPrice.toLocaleString()}₫
            </span>
          </p>
          <p className="text-lg font-semibold my-4">
            Shipping cost: <span className="text-headingColor">20.000₫</span>
          </p>
          <p className="text-lg font-semibold my-4">
            Total amount:{' '}
            <span className="text-primaryColor">
              {(totalCartPrice + 20000).toLocaleString()}₫
            </span>
          </p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleConfirmOrder}
              className="w-auto bg-primaryColor hover:bg-red-700 text-white rounded-lg p-2"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
