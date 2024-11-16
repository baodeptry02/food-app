import React, { useState } from "react";
import Lottie from "lottie-react";
import { useSelector } from "react-redux";
import Edit from "../../animations/Edit.json";

const Profile = () => {
  const user = useSelector((state) => state.userState.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "1234 Main Street, Los Angeles, CA 90001",
    city: "Los Angeles",
    postalCode: "90012",
    country: "USA",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(true);
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
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-2 pb-6 w-full max-w-4xl">
        {!isEditing && (
          <div className="flex justify-end">
            <button
              onClick={toggleEdit}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Lottie
                animationData={Edit}
                loop={true}
                autoplay={true}
                style={{ width: 80, height: 80 }}
              />
            </button>
          </div>
        )}
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-gray-300"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M16 4h5v5m-9 9l-9 9V14h4l4-4z"
                />
              </svg>
            </button>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                User Name
              </label>
              <input
                type="text"
                value={user?.uid || ""}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="text"
                value="January 1, 1987"
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Permanent Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Present Address
              </label>
              <input
                type="text"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="mt-8 text-right">
          {isEditing ? (
            <>
              <button
                onClick={cancelEdit}
                className="bg-gray-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-700 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={toggleEdit}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
