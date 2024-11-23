import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BsFillBellFill,
  BsToggles2,
  MdLogout,
  MdSearch,
} from '../assests/icons/index';
// import { useLocation } from '../context/LocationContext'; // Ensure the path is correct
import { buttonClick } from '../animations';
import { motion } from 'framer-motion';
import { Avatar } from '../assests';
import { getAuth } from 'firebase/auth';
import { logoutUser } from '../context/actions/userActions';
import { app } from '../config/firebase.config';
import { useNavigate } from 'react-router-dom';

const DBHeader = () => {
  const user = useSelector((state) => state.userState.user);

  // const { location, error } = useLocation();
  // const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(logoutUser());
    firebaseAuth
      .signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        throw error;
      });
  };

  // const getHumanReadableLocation = async (latitude, longitude) => {
  //   const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     if (data && data.display_name) {
  //       return data.display_name;
  //     } else {
  //       console.error("Error fetching location:", data);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   if (location) {
  //     getHumanReadableLocation(location.latitude, location.longitude).then(
  //       (address) => {
  //         if (address) {
  //           setAddress(address);
  //         }
  //       }
  //     );
  //   }
  // }, [location]);

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <p className="text-2xl text-headingColor dark:text-white transition-colors duration-500 ease-in-out">
        Welcome to City
        {user?.name && (
          <span className="block text-base text-gray-500 dark:text-white transition-colors duration-500 ease-in-out">{`Hello ${user?.name} ...!`}</span>
        )}
        {/* {address && (
          <span className="block text-base text-gray-500 dark:text-white transition-colors duration-500 ease-in-out">{`Your location: ${address}`}</span>
        )}
        {error && (
          <span className="block text-base text-red-500">{`Error: ${error}`}</span>
        )} */}
      </p>
      <div className=" flex items-center justify-center gap-4 ">
        <div className=" flex items-center justify-center gap-3 px-4 py-2 bg-lightOverlay dark:bg-slate-200 backdrop-blur-md rounded-md shadow-md transition-colors duration-500 ease-in-out">
          <MdSearch className="text-gray-400  text-2xl " />
          <input
            type="text"
            placeholder="Search Here..."
            className="border-none outline-none bg-transparent w-32 text-base font-semibold text-textColor"
          />
          <BsToggles2 className="text-gray-400 text-2xl" />
        </div>

        <motion.div
          {...buttonClick}
          className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay dark:bg-slate-200 backdrop-blur-md shadow-md flex items-center justify-center transition-colors duration-500 ease-in-out"
        >
          <BsFillBellFill className="text-gray-400 text-xl" />
        </motion.div>

        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-md shadow-md cursor-pointer overflow-hidden">
            <motion.img
              className="w-full h-full object-cover dark:bg-slate-200 transition-colors duration-500 ease-in-out"
              src={user?.photoURL || user?.picture || Avatar}
              whileHover={{ scale: 1.15 }}
              referrerPolicy="no-referrer"
            />
          </div>

          <motion.div
            {...buttonClick}
            onClick={signOut}
            className="w-10 h-10 rounded-md cursor-pointer bg-lightOverlay backdrop-blur-md shadow-md flex items-center justify-center dark:bg-slate-200 transition-colors duration-300 ease-in-out transition-colors duration-500 ease-in-out"
          >
            <MdLogout className="text-gray-400 text-xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DBHeader;
