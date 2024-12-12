import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrder } from '../../api/orderApi';
import { Empty } from 'antd';
import Shopping from '../../animations/Shopping.json';
import Lottie from 'lottie-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const user = useSelector((state) => state?.userState?.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State để lưu lỗi

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null); // Reset lỗi khi bắt đầu fetch
        if (user?.uid && orderId) {
          const res = await getOrder(user.uid, orderId);
          if (res.status !== 404) {
            setData(res);
          } else {
            return;
          }
        } else {
          throw new Error('Invalid user or order ID.');
        }
      } catch (err) {
        setError(err.message); // Cập nhật lỗi
        console.error('Error while fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user?.uid, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading order details...</p>
      </div>
    );
  }

  console.log(data);

  return data ? (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-6xl w-full flex">
        {/* Bên trái */}
        <div className="flex flex-col justify-center w-1/2 p-4">
          {data?.selectedProducts.length > 2 ? (
            <Lottie animationData={Shopping} className="w-1/2 mx-auto" />
          ) : (
            <Lottie animationData={Shopping} className="w-1/3 mx-auto" />
          )}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Thank you for your purchase!
          </h1>
          <p className="text-gray-600 mb-6">
            Your order will be processed within 24 hours during working days. We
            will notify you by email once your order has been shipped.
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Billing address
          </h2>
          <p className="text-gray-600 mb-1">
            Name: <span className="font-medium">{user?.name}</span>
          </p>
          <p className="text-gray-600 mb-1">
            Address:{' '}
            <span className="font-medium">
              {data?.deliveryAddress || 'N/A'}
            </span>
          </p>
          <p className="text-gray-600 mb-1">
            Phone:{' '}
            <span className="font-medium">{user?.phoneNumber || 'N/A'}</span>
          </p>
          <p className="text-gray-600">
            Email: <span className="font-medium">{user?.email}</span>
          </p>
          <button
            className="mt-6 max-w-[40%] bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-lg rounded-full shadow-md"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>

        {/* Bên phải */}
        <div className="border-l border-gray-300 pl-6 w-1/2">
          <h2 className="text-xl bg-primary font-semibold text-gray-800 p-4 rounded-lg">
            Order Summary
          </h2>
          <div className="border bg-primary rounded-lg p-4 mt-4">
            <div className="mb-4 flex justify-evenly items-center">
              <p className="text-gray-600 mb-2">
                <strong className="block">Order Number:</strong> {orderId}
              </p>
              <div className="h-12 border-l border-gray-300"></div>
              <p className="text-gray-600 mb-2">
                <strong className="block">Payment Method:</strong>{' '}
                {data?.paymentMethod || 'QR Payment'}
              </p>
              <div className="h-12 border-l border-gray-300"></div>
              <p className="text-gray-600 mb-2">
                <strong className="block">Order Status:</strong> {data?.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Date:</strong>{' '}
                {data?.createdAt
                  ? new Date(data.createdAt._seconds * 1000).toLocaleString(
                      'en-US'
                    )
                  : 'N/A'}
              </p>
            </div>
            <div className="border-t border-gray-200 py-4">
              {data?.selectedProducts?.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4 border-b border-gray-300 py-2"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.img}
                      alt={product.itemName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {product.itemName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800">
                    {product.price?.toLocaleString() || 'N/A'} ₫
                  </p>
                </div>
              ))}
            </div>
            <div>
              <p className="flex justify-between text-gray-600 mb-1">
                <span>Sub Total:</span>{' '}
                <span>
                  {(data?.totalCartPrice - 20000)?.toLocaleString() || 'N/A'} ₫
                </span>
              </p>
              <p className="flex justify-between text-gray-600 mb-1">
                <span>Shipping:</span> <span>20.000 ₫</span>
              </p>
              <p className="flex justify-between text-gray-800 font-bold text-lg">
                <span>Order Total:</span>{' '}
                <span>
                  {data?.totalCartPrice
                    ? data.totalCartPrice.toLocaleString()
                    : 'N/A'}{' '}
                  ₫
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-primaryColor">
          OrderID: {orderId} not found!
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
};

export default OrderSuccess;
