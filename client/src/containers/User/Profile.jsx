import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { useSelector, useDispatch } from 'react-redux';
import Edit from '../../animations/Edit.json';
import DarkEdit from '../../animations/DarkEdit.json';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CountrySelector from '../../utils/CountrySelector';
import Typed from 'typed.js';
import DateSelector from '../../utils/DateSelector';
import AddressSelector from '../../utils/AddressSelector';
import { updateUserInFirestore } from '../../utils/fireStores.utils';
import { setUserDetails } from '../../context/actions/userActions';

const Profile = () => {
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const typedElement = useRef(null);
  const [addressData, setAddressData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [formData, setFormData] = useState({
    uid: user?.uid || '',
    photoURL: user?.photoURL || '',
    name: user?.name || '',
    email: user?.email || '',
    country: user?.country || '',
    phoneNumber: user?.phoneNumber || 'N/A',
    gender: user?.gender || 'male',
    lastSignIn: user?.lastSignIn || 'N/A',
    dateOfBirth: user?.dateOfBirth || { day: '', month: '', year: '' },
    createdAt: user?.createdAt || 'N/A',
    address: user?.address || {
      provinceName: '',
      districtName: '',
      wardName: '',
      manualAddress: '',
    },
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleAddressChange = (address) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        provinceId: address.provinceId || prev.address.provinceId,
        districtId: address.districtId || prev.address.districtId,
        wardId: address.wardId || prev.address.wardId,
        provinceName: address.provinceName || prev.address.provinceName,
        districtName: address.districtName || prev.address.districtName,
        wardName: address.wardName || prev.address.wardName,
        manualAddress: address.manualAddress || prev.address.manualAddress,
      },
    }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setIsHovering(false);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      ...formData,
      name: user?.name || '',
      country: user?.country || '',
      phoneNumber: user?.phoneNumber || 'N/A',
      gender: user?.gender || 'male',
      dateOfBirth: user?.dateOfBirth || { day: '', month: '', year: '' },
      address: user?.address || {
        provinceName: '',
        districtName: '',
        wardName: '',
        manualAddress: '',
      },
    });
  };

  // Show alert if not in edit mode
  const showAlert = () => {
    if (!isEditing) {
      toast.info('Please click the Edit button to make changes.');
    }
  };

  useEffect(() => {
    const options = {
      strings: ['Welcome to your profile', 'Edit your profile here!'],
      typeSpeed: 30,
      backSpeed: 30,
      backDelay: 400,
      loop: true,
    };

    const typed = new Typed(typedElement.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await updateUserInFirestore(user.uid, formData);
      localStorage.setItem('user', JSON.stringify(formData));
      dispatch(setUserDetails(formData));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl px-8 py-6 pb-6 w-full xl:max-w-[60%] max-w-[70%]">
        <div className="text-4xl font-bold pl-8 pb-4">
          Hello,
          <span className="text-primaryColor dark:text-white mr-4">
            {' '}
            {user?.gender === 'male'
              ? 'Sir'
              : user?.gender === 'female'
                ? 'Madame'
                : 'User'}
            !
          </span>
          <span
            className="text-black dark:text-[#FF5733]"
            ref={typedElement}
          ></span>{' '}
        </div>
        <hr />
        <div className="flex justify-between items-center mt-4">
          <div className="pl-8 text-2xl font-bold text-primaryColor dark:text-white">
            Personal Profile
          </div>
          <button
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="flex items-center"
            onClick={toggleEdit}
          >
            <Lottie
              key={isDarkMode ? 'dark' : 'light'}
              className="cursor-pointer w-12 h-12"
              animationData={isDarkMode ? DarkEdit : Edit}
              loop={isHovering}
              autoplay={isHovering}
              isStopped={!isHovering}
            />
            <span className="dark:text-white">Edit Profile</span>
          </button>
        </div>
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Profile Picture and Details */}
          <div className="w-full md:w-1/3 text-center pt-4">
            <div className="relative w-32 h-32 mx-auto">
              {/* Avatar Image */}
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-full h-full rounded-full shadow-md mb-4 hover:scale-105 transi"
              />
              {/* Camera Icon */}
              <button className="absolute bottom-0 right-0 bg-primaryColor text-white p-1.5 rounded-full shadow-lg">
                <FaCamera />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-8 w-full overflow-hidden whitespace-nowrap justify-center">
              {/* Created At */}
              <h1 className="text-lg font-semibold text-primaryColor">
                Created At:
              </h1>
              <span className="ml-2 text-lg">
                {new Date(user?.createdAt?._seconds * 1000).toLocaleDateString(
                  'vi-VN'
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 w-full overflow-hidden whitespace-nowrap justify-center">
              {/* Created At */}
              <h1 className="text-lg font-semibold text-primaryColor">
                Last SignIn:
              </h1>
              <span className="ml-2 text-lg">{user?.lastSignIn}</span>
            </div>
            <button className="button-profile">Change Password</button>
          </div>
          {/* User Information Form */}
          <div className=" gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  onClick={showAlert}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  onClick={showAlert}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  onClick={showAlert}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  onClick={showAlert}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Date of Birth
                </label>
                <DateSelector
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Country
                </label>
                <CountrySelector
                  value={formData.country}
                  onChange={handleInputChange}
                  isEditing={isEditing}
                  onClick={showAlert}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-5 gap-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                  Address Detail
                </label>
                <AddressSelector
                  value={formData.address}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  setAddressData={setAddressData}
                />
              </div>
            </div>
            <div className="mt-5 gap-4">
              <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                Street
              </label>
              <div>
                {formData.address?.manualAddress && !isEditing ? (
                  // Hiển thị địa chỉ nếu không chỉnh sửa
                  <div className="mb-2">
                    <input
                      className="w-[40%] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
                      value={formData.address.manualAddress}
                      readOnly={true}
                      onClick={showAlert}
                    />
                  </div>
                ) : (
                  // Hiển thị dropdown nếu đang chỉnh sửa
                  <div>
                    {addressData && addressData.length > 0 ? (
                      <select
                        id="address-select"
                        value={
                          selectedAddress ||
                          formData.address?.manualAddress ||
                          ''
                        }
                        onChange={(e) => {
                          const selected = e.target.value;
                          setSelectedAddress(selected);
                          handleAddressChange({
                            manualAddress: selected,
                          });
                        }}
                        className="w-auto border border-gray-300 rounded-md px-1 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 mr-4"
                      >
                        <option value="">Select Street Detail</option>
                        {addressData.map((address, index) => (
                          <option key={index} value={address}>
                            {address}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-right">
          {isEditing ? (
            <>
              <button
                onClick={cancelEdit}
                className="bg-gray-600 dark:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primaryColor dark:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 dark:hover:bg-blue-600"
              >
                Save
              </button>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
