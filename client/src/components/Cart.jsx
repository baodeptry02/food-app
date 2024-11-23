import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StepProgressBar from './ProgressBar';
import { VietQR, ZaloPay } from '../assests';
import { BiTrash } from 'react-icons/bi';

const Cart = () => {
  const cart = useSelector((state) => state.cartState.cartItems);
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // const updateQuantity = (id, newQuantity) => {
  //   if (newQuantity > 0) {
  //     dispatch(updateCartItem({ id, quantity: newQuantity }));
  //   }
  // };

  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) =>
        selectedItems.includes(item.id)
          ? total + item.price * item.quantity
          : total,
      0
    );
  };

  const totalCartPrice = calculateTotalPrice();

  return (
    <div className="pt-12 bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      {/* Thanh tiến trình nằm ở trên cùng */}
      <div className="p-4">
        <StepProgressBar />
      </div>

      {/* Layout chính của trang */}
      <div className="w-full flex flex-col lg:flex-row gap-6 p-8 px-60">
        {/* Bên trái: Render sản phẩm trong giỏ hàng */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-darkSecondary p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Your Order</h2>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border-b dark:border-darkBg"
              >
                {/* Checkbox để chọn sản phẩm */}
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
                <div className="flex flex-col w-2/3 ml-4">
                  <h3 className="text-lg font-semibold">{item.itemName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.price.toLocaleString()}₫ / product
                  </p>
                </div>

                {/* Điều chỉnh số lượng */}
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300"
                    // onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <p className="text-center w-6">{item.quantity}</p>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300"
                    // onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Tổng tiền sản phẩm */}
                <p className="text-sm font-bold text-primaryColor px-4">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>

                {/* Biểu tượng thùng rác để xóa sản phẩm */}
                <button
                  className="text-headingColor hover:text-red-700 text-xl"
                  // onClick={() => dispatch(removeCartItem(item.id))}
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
          className="w-full lg:w-1/3 bg-white dark:bg-darkSecondary p-6 rounded-lg shadow relative lg:sticky lg:top-16"
          style={{ height: '400px' }} // Cố định chiều cao
        >
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <p className="text-lg font-semibold">
            Shipping cost: <span className="text-headingColor">20.000₫</span>
          </p>
          <p className="text-lg font-semibold">
            Total amount:{' '}
            <span className="text-primaryColor">
              {(totalCartPrice + 20000).toLocaleString()}₫
            </span>
          </p>
          <p className="text-xl text-black font-bold mt-4">
            Shipping fee will be added at checkout !
          </p>

          {/* Tiêu đề với 2 thanh ngang */}
          <div className="flex items-center my-6">
            <span className="flex-grow h-[1px] bg-gray-300"></span>
            <p className="px-8 text-gray-500 text-base">
              Choose payment method
            </p>
            <span className="flex-grow h-[1px] bg-gray-300"></span>
          </div>

          {/* Các nút thanh toán */}
          <div className="flex flex-col items-center">
            {/* Nút VietQR */}
            <button className="relative w-[80%] border-red-400 border-2 text-primaryColor rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group">
              <span className="absolute inset-0 bg-red-400 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
              <img className="w-6 h-6 relative z-10" src={VietQR} alt="" />
              <span className="relative z-10 text-primaryColor group-hover:text-white transition-colors duration-500 ease-in-out">
                Pay with VietQR
              </span>
            </button>

            {/* Nút ZaloPay */}
            <button className="relative w-[80%] border-blue-500 border-2 text-blue-500 rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group">
              <span className="absolute inset-0 bg-blue-500 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
              <img className="w-6 h-6 relative z-10" src={ZaloPay} alt="" />
              <span className="relative z-10 text-blue-500 group-hover:text-white transition-colors duration-500 ease-in-out">
                Pay with ZaloPay
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
