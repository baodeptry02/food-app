import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StepProgressBar } from '../../components';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { Empty } from 'antd';
import { BiEdit } from 'react-icons/bi';
import { VietQR, ZaloPay } from '../../assests';
import { removeSelectedItems } from '../../context/actions/cartAction';
import axios from 'axios';
import Edit from '../../animations/Edit.json';
import Lottie from 'lottie-react';
import gsap from 'gsap';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import { createOrder } from '../../api/orderApi';
import { removeCartItem } from '../../api/cartApi';

const ConfirmOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useSelector((state) => state?.cartState?.cartItems);
  const selectedProducts =
    useSelector((state) => state?.cartState?.selectedProducts) ||
    location?.state?.selectedProducts;
  const user = useSelector((state) => state?.userState?.user);
  const [orderId, setOrderId] = useState('');
  const shippingFee = 20000;
  const [fullAddress, setFullAddress] = useState('');
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState(fullAddress);
  const [date, setDate] = useState(fullAddress);
  const itemsRef = useRef([]);
  const paymentButtonsRef = useRef([]);
  const titleOrder = useRef(null);
  const shipping = useRef(null);
  const payment = useRef(null);
  const container = useRef(null);
  const buttonBack = useRef(null);
  const timeExpired = moment().add(3, 'hours').format('MMM D YYYY, h:mm:ss A');
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateOrderId = () => {
      const randomString = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const order_id = `FDC${randomString}`;
      setOrderId(order_id);
      // setOrderId('FDCEZDXWLL6');
      setDate(moment().format('MMM D, YYYY'));
    };

    generateOrderId();
  }, []);

  if (!selectedProducts || selectedProducts?.length === 0) {
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
            description="Your order is empty"
          />
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/me/cart')}
              className="px-6 py-2 bg-primaryColor text-white rounded-lg"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedProductIds = selectedProducts?.map((product) => product.id);
  const selectedCartItems = cart.filter((item) =>
    selectedProductIds.includes(item.id)
  );

  const subtotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleZaloPay = async () => {
    const userId = user.uid;
    const selectedProductIds = selectedItems.map((item) => item.id);
    dispatch(removeSelectedItems(selectedItems));
    try {
      const result = await axios.post(
        'http://localhost:5001/lms-backend-1d9f5/us-central1/app/api/payment/zalopay',
        {
          totalCartPrice,
          selectedProductIds,
          userId,
        }
      );
      const responseData = result.data;
      window.location.href = responseData.result.order_url;
    } catch (error) {
      console.error('Error occurred during payment:', error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  useEffect(() => {
    if (user?.address) {
      const address = `${user.address.manualAddress}, ${user.address.wardName}, ${user.address.districtName}, ${user.address.provinceName}`;
      setFullAddress(address);
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleAddressChange = (e) => {
    setEditedAddress(e.target.value);
  };

  const handleSaveClick = () => {
    setFullAddress(editedAddress);
    setIsEditing(false);
  };

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
    tl.fromTo(
      container.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
    tl.fromTo(
      titleOrder.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      }
    );
    tl.fromTo(
      itemsRef.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power3.out',
      },
      '-=0.2'
    );
    tl.fromTo(
      shipping.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      }
    );
    tl.fromTo(
      payment.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      }
    );
    tl.fromTo(
      paymentButtonsRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );
  }, []);
  const handleQRPay = async () => {
    try {
      setLoading(true);
      await createOrder(
        orderId,
        user.uid,
        timeExpired,
        totalCartPrice,
        fullAddress,
        selectedProducts
      );
      dispatch(
        removeSelectedItems(selectedProducts.map((product) => product.id))
      );
      const removeRequests = selectedProducts.map((product) =>
        removeCartItem(user.uid, product.id)
      );
      await Promise.all(removeRequests);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
      navigate(`/payment/vietqr/${orderId}`, {
        replace: true,
        state: {
          totalCartPrice,
          orderId,
          date,
          timeExpired,
        },
      });
    }
  };

  useEffect(() => {
    setTotalCartPrice(subtotal + shippingFee);
  }, [subtotal]);

  return (
    <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <div className="p-4">
        <StepProgressBar />
      </div>
      <div className="py-6 p-4 max-w-4xl mx-auto">
        <button
          ref={buttonBack}
          className=" cursor-pointer flex items-center gap-2 bg-primaryColor hover:bg-red-600 px-4 py-2 text-lg text-white font-semibold rounded-full"
          onClick={() => navigate('/me/cart')}
        >
          <IoIosArrowRoundBack />
          <span>Back</span>
        </button>
      </div>
      <div
        ref={container}
        className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-2xl"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-primaryColor">
          Order Summary
        </h1>
        <div ref={titleOrder} className="flex justify-between py-3">
          <div className="flex items-center gap-3">
            <p className="font-bold pl-2">Order No.</p>
            <p className="font-bold text-primaryColor">{orderId}</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-bold">Order Date</p>
            <p className="font-bold text-primaryColor">{date}</p>
          </div>
        </div>
        {selectedCartItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-gray-300 py-4"
            ref={(el) => (itemsRef.current[index] = el)}
          >
            <div className="flex items-center gap-4">
              <img
                src={item.img}
                alt={item.itemName}
                className="w-32 h-20 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.itemName}</h3>
                <h3 className="font-semibold text-lg">
                  {item.price.toLocaleString()}
                </h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="font-bold">
              {(item.quantity * item.price).toLocaleString()}₫
            </p>
          </div>
        ))}

        <div className="flex gap-12">
          <div ref={shipping} className="mt-6 leading-8">
            <h2 className="text-lg font-bold mb-2">
              Payment & Shipping details
            </h2>
            <div className="text-gray-600">
              <div className="flex items-start">
                <p className="w-36 flex-shrink-0">Delivered to:</p>
                <span className="font-semibold">
                  {user.name || user.email.split('@')[0]}
                </span>
              </div>
              <div className="flex items-start mt-2 ">
                <p className="w-36 flex-shrink-0">Delivery address:</p>
                {isEditing ? (
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      value={editedAddress}
                      onChange={handleAddressChange}
                      className="border border-gray-300 rounded-md min-w-[432px] px-3"
                    />
                    <div className="flex mt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="relative px-4 py-1.5 border-red-500 border-2 text-black rounded-lg overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-red-500 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out">
                          Cancel
                        </span>
                      </button>
                      <button
                        onClick={handleSaveClick}
                        className="ml-2 px-4 py-1.5 bg-primaryColor border-2 border-primaryColor text-white rounded-lg hover:bg-red-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold break-words min-w-[360px]">
                      {fullAddress || 'Please update your address'}
                    </span>
                    <div className="relative group">
                      <Lottie
                        animationData={Edit}
                        className="text-primaryColor w-16 h-16 cursor-pointer inline-block"
                        onClick={handleEditClick}
                      />
                      <span className="absolute w-[86px] bottom-[-0.5rem] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                        Edit Address
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center my-4">
                <span className="flex-grow h-[1px] bg-gray-300"></span>
                <p className="px-8 text-gray-500 text-base">
                  Choose payment method
                </p>
                <span className="flex-grow h-[1px] bg-gray-300"></span>
              </div>
              <div className="flex flex-col items-center payment-item">
                <button
                  ref={(el) => paymentButtonsRef.current.push(el)}
                  onClick={handleQRPay}
                  className="relative w-[30%] border-red-400 border-2 text-primaryColor rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-red-400 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                  <img className="w-6 h-6 relative z-10" src={VietQR} alt="" />
                  <span className="relative z-10 text-primaryColor group-hover:text-white transition-colors duration-500 ease-in-out">
                    Pay with VietQR
                  </span>
                </button>
                <button
                  ref={(el) => paymentButtonsRef.current.push(el)}
                  onClick={handleZaloPay}
                  className="relative w-[30%] border-blue-500 border-2 text-blue-500 rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-blue-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                  <img className="w-6 h-6 relative z-10" src={ZaloPay} alt="" />
                  <span className="relative z-10 text-blue-500 group-hover:text-white transition-colors duration-500 ease-in-out">
                    Pay with ZaloPay
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div
            ref={payment}
            className="mt-6 bg-gray-100 p-4 rounded-md min-w-60 h-36"
          >
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <p className="font-semibold">{subtotal.toLocaleString()}₫</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p>Shipping Fee</p>
              <p className="font-semibold">{shippingFee.toLocaleString()}₫</p>
            </div>
            <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-4">
              <p className="font-bold text-lg text-primaryColor">Total</p>
              <p className="font-bold text-lg text-primaryColor">
                {totalCartPrice.toLocaleString()}₫
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
