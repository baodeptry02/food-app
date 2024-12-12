import React, { useEffect, useRef, useState } from 'react';
import StepProgressBar from './ProgressBar';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import sus from '../animations/sus.json';
import Lottie from 'lottie-react';
import { checkTransaction } from '../api/transactionApi';
import { debounce } from 'lodash';
import { updateOrder } from '../api/orderApi';
import { useSelector } from 'react-redux';
const Vietqr = () => {
  const location = useLocation();
  const user = useSelector((state) => state?.userState?.user);
  const { totalCartPrice, orderId, date, timeExpired } = location.state || {};
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  const fetchTransaction = async () => {
    try {
      const res = await checkTransaction(orderId);
      if (res.status !== 200) {
        console.log('fail');
        return;
      } else {
        toast.success('Payment success!');
        clearInterval(timerRef.current);
        await updateOrder(user.uid, orderId);
        navigate(`/me/order-success/${orderId}`, { replace: true });
        return;
      }
    } catch (error) {
      console.error('Error while fetching transaction:', error);
    }
  };

  const debouncedFetchTransaction = debounce(fetchTransaction, 1000);

  useEffect(() => {
    const CHECK_INTERVAL = 10000;
    timerRef.current = setInterval(() => {
      debouncedFetchTransaction();
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(timerRef.current);
      debouncedFetchTransaction.cancel();
    };
  }, [orderId]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  //   if (!totalCartPrice || !orderId || !date) {
  //     navigate('/me/cart');
  //     return;
  //   }
  useEffect(() => {
    if (!totalCartPrice || !orderId || !date || !timeExpired) {
      toast.error('Dữ liệu không hợp lệ hoặc bị thiếu!');
      navigate(-1); // Quay lại trang trước đó
    }
  }, [totalCartPrice, orderId, date, timeExpired, navigate]);

  return (
    <div className="pt-32 pb-12 h-full min-h-screen bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <div className="px-24">
        <StepProgressBar />
      </div>
      <div className="py-6 p-4 max-w-4xl mx-auto">
        <button
          className="cursor-pointer flex items-center gap-2 bg-[#E95B5B] hover:bg-red-600 px-4 py-2 text-lg text-white font-semibold rounded-full"
          onClick={() => navigate('/me/cart')}
        >
          <IoIosArrowRoundBack />
          <span>Back</span>
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl">
        <div className="flex flex-col md:flex-row text-primary">
          <div className="w-full md:w-1/3 bg-[#E95B5B] p-12 rounded-lg mx-auto">
            <p
              onMouseEnter={handleMouseEnter}
              onAnimationEnd={handleAnimationEnd}
              className={`app-name font-semibold text-3xl tracking-[8px] font-dancing cursor-pointer ${
                isAnimating ? 'animate' : ''
              }`}
            >
              <svg height="40" width="200" xmlns="http://www.w3.org/2000/svg">
                <text
                  x="5"
                  y="30"
                  fill="none"
                  stroke="white"
                  className="dark:stroke-white transition-colors duration-500 ease-in-out"
                  fontSize="35"
                >
                  City!
                </text>
              </svg>
            </p>
            <p className="mt-4">Đơn hàng hết hạn vào:</p>
            <p className="text-white font-medium">{timeExpired}</p>
            <p className="mt-4">Nhà cung cấp:</p>
            <p className="text-white font-medium">SePay</p>
            <p className="mt-4">Hình thức thanh toán:</p>
            <p className="text-white font-medium">Scan QR</p>
            <p className="mt-4">Tổng thanh toán:</p>
            <p className="text-white font-medium">
              {totalCartPrice?.toLocaleString()}₫
            </p>
            <p className="mt-4">Mã đơn hàng:</p>
            <p className="text-white font-medium">{orderId}</p>
            <p className="mt-4">Trạng thái:</p>
            <p className="text-white font-medium">Pending...</p>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-6">
            <h2 className="text-lg font-bold text-center text-gray-700">
              Quét mã để thanh toán
            </h2>
            <div className="border-4 border-gray-300 rounded-lg p-4 mt-6">
              {/* https://qr.sepay.vn/img?acc=SO_TAI_KHOAN&bank=NGAN_HANG&amount=SO_TIEN&des=NOI_DUNG&template=TEMPLATE&download=DOWNLOAD */}
              <img
                src={`https://qr.sepay.vn/img?acc=0911146605&bank=MBBANK&amount=${totalCartPrice}&des=${orderId}&template=compact&download=true`}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
            <p className="mt-6 text-gray-500">
              Sử dụng App ngân hàng hoặc Camera hỗ trợ QR Code để quét mã
            </p>
            <div className="flex items-center justify-between">
              <Lottie className="w-20 h-20" animationData={sus} autoPlay loop />
              <p className="text-red-500 font-medium mt-2">
                Đang chờ bạn quét mã...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vietqr;
