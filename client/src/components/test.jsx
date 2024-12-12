// const [fullAddress, setFullAddress] = useState('');

// useEffect(() => {
//   if (user?.address) {
//     const address = `${user.address.manualAddress}, ${user.address.wardName}, ${user.address.districtName}, ${user.address.provinceName}`;
//     setFullAddress(address);
//   }
// }, [user]);

const hanleZaloPay = async () => {
  const selectedProductIds = cart
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => item.id);

  try {
    const result = await axios.post(
      'http://localhost:5001/lms-backend-1d9f5/us-central1/app/api/payment/zalopay',
      {
        totalCartPrice,
        selectedProductIds,
        userId,
      }
    );
    dispatch(removeSelectedItems(selectedProductIds));
    const responseData = result.data;
    window.location.href = responseData.result.order_url;

    //   navigate("/payment", {
    //     state: {
    //       qrCodeString: responseData.result.qr_code,
    //       url: responseData.result.order_url,
    //       order: responseData.order,
    //     },
    //   });
  } catch (error) {
    console.error('Đã xảy ra lỗi khi thanh toán:', error);
    alert('Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.');
  }
};

// const paymentElements = gsap.utils.toArray('.payment-item'); // Select all payment elements
// tl.fromTo(
//   paymentElements,
//   { x: -100, opacity: 0 },
//   {
//     x: 0,
//     opacity: 1,
//     stagger: 0.2,
//     duration: 0.6,
//     ease: 'power3.out',
//   },
//   '-=0.3' // Start before the previous animation finishes
// );

{
  /* <div className="flex items-center my-6">
            <span className="flex-grow h-[1px] bg-gray-300"></span>
            <p className="px-8 text-gray-500 text-base">
              Choose payment method
            </p>
            <span className="flex-grow h-[1px] bg-gray-300"></span>
          </div> */
}
{
  /* <div className="flex flex-col items-center payment-item">
            <button className="relative w-[80%] border-red-400 border-2 text-primaryColor rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group">
              <span className="absolute inset-0 bg-red-400 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
              <img className="w-6 h-6 relative z-10" src={VietQR} alt="" />
              <span className="relative z-10 text-primaryColor group-hover:text-white transition-colors duration-500 ease-in-out">
                Pay with VietQR
              </span>
            </button>
            <button
              className="relative w-[80%] border-blue-500 border-2 text-blue-500 rounded-xl p-2 mt-4 flex items-center justify-center gap-4 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-blue-500 scale-x-0 origin-center group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
              <img className="w-6 h-6 relative z-10" src={ZaloPay} alt="" />
              <span className="relative z-10 text-blue-500 group-hover:text-white transition-colors duration-500 ease-in-out">
                Pay with ZaloPay
              </span>
            </button>
          </div> */
}
