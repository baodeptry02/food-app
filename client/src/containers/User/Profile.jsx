import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { useSelector } from "react-redux";
import Edit from "../../animations/Edit.json";
import DarkEdit from "../../animations/DarkEdit.json";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import CountrySelector from "../../utils/CountrySelector";
import Typed from "typed.js";

const Profile = () => {
  const user = useSelector((state) => state.userState.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const typedElement = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "1234 Main Street, Los Angeles, CA 90001",
    city: "Los Angeles",
    postalCode: "90012",
    country: "USA",
    phoneNumber: user?.phoneNumber || "N/A",
    gender: user?.gender || "male",
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
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

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setIsHovering(false);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      address: "1234 Main Street, Los Angeles, CA 90001",
      city: "Los Angeles",
      postalCode: "90012",
      country: "USA",
      phoneNumber: user?.phoneNumber || "N/A",
      gender: user?.gender || "male",
    });
  };

  // Show alert if not in edit mode
  const showAlert = () => {
    if (!isEditing) {
      toast.info("Please click the Edit button to make changes.");
    }
  };

  useEffect(() => {
    const options = {
      strings: ["Welcome to your profile", "Edit your profile here!"],
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

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl px-8 py-6 pb-6 w-full xl:max-w-[50%] max-w-[70%]">
        <div className="text-4xl font-bold pl-8 pb-4">
          Hello,
          <span className="text-primaryColor dark:text-white mr-4">
            {" "}
            {user?.gender === "male"
              ? "Sir"
              : user?.gender === "female"
              ? "Madame"
              : "User"}
            !
          </span>
          <span
            className="text-black dark:text-[#FF5733]"
            ref={typedElement}
          ></span>{" "}
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
              key={isDarkMode ? "dark" : "light"}
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
                className="w-full h-full rounded-full shadow-md mb-4"
              />
              {/* Camera Icon */}
              <button className="absolute bottom-0 right-0 bg-primaryColor text-white p-1.5 rounded-full shadow-lg">
                <FaCamera />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-8 w-full overflow-hidden whitespace-nowrap">
              {/* Created At */}
              <h1 className="text-lg font-semibold text-primaryColor">
                Created At:
              </h1>
              <span className="ml-2 text-lg">
                {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString(
                  "vi-VN"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 w-full overflow-hidden whitespace-nowrap">
              {/* Created At */}
              <h1 className="text-lg font-semibold text-primaryColor">
                Last SignIn:
              </h1>
              <span className="ml-2 text-lg">{user.lastSignIn}</span>
            </div>
            <button className="button-profile">Change Password</button>
          </div>
          {/* User Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">
                Country
              </label>
              <CountrySelector
                value={formData.country}
                onChange={handleInputChange}
                isEditing={isEditing}
                onClick={showAlert}
              />
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
                onClick={() => setIsEditing(false)}
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
