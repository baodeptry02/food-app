import React, { useEffect, useRef, useState } from "react";
import {
  MdLightMode,
  MdLogout,
  MdOutlineLightMode,
  MdShoppingCart,
} from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Logo, Astronaut } from "../assests";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles.utils";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick, slideTop } from "../animations/index";
import { logoutUser } from "../context/actions/userActions";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { IoMoonOutline } from "react-icons/io5";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LoadingAnimation from "../animations/loading-animation";
import { MotionPathPlugin } from "gsap/all";

const NotFound = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);
  const [isMenu, setIsMenu] = useState(false);
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);
  useGSAP(() => {
    gsap.set(".navlink", { opacity: 1 });
    gsap.set(".logo", { opacity: 1 });

    gsap.registerPlugin(MotionPathPlugin);

    gsap.to(".img", {
      duration: 10,
      repeat: -1,
      ease: "none",
      immediateRender: true,
      motionPath: {
        path: [
          { x: 0, y: 0, z: 0 },
          { x: 40, y: 0, z: 50 },
          { x: 40, y: 40, z: 0 },
          { x: 0, y: 40, z: -50 },
          { x: 0, y: 0, z: 0 },
        ],
        curviness: 0,
        rotation: 90,
      },
    });
  });

  const signOut = () => {
    dispatch(logoutUser());
    firebaseAuth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        throw error;
      });
  };
  return (
    <div className="h-screen flex justify-center items-center bg-galaxy">
      <div className="flex flex-col h-3/4 w-2/3 bg-white rounded-3xl">
        {/* Header */}
        <header className="text-black flex items-center justify-between p-4 rounded-t-3xl px-28">
          <NavLink
            to={"/"}
            className="logo flex items-center justify-center gap-4 opacity-0 "
          >
            <img src={Logo} className="w-12" alt="Logo" />
            <p className="font-semibold text-xl text-black">City</p>
          </NavLink>
          <nav className="flex items-center justify-center gap-8">
            <ul className="hidden md:flex items-center justify-center gap-16">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0 `
                }
                to={"/"}
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0 `
                }
                to={"/menu"}
              >
                Menu
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0 `
                }
                to={"/services"}
              >
                Services
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0 `
                }
                to={"/aboutus"}
              >
                About Us
              </NavLink>
            </ul>

            <motion.div
              {...buttonClick}
              onClick={() => dispatch()}
              className="relative cursor-pointer navlink"
            >
              <MdShoppingCart className="text-3xl text-textColor" />
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-2">
                <p className="text-primary text-base font-semibold">2</p>
              </div>
            </motion.div>

            {user ? (
              <div
                className="relative cursor-pointer navlink"
                onMouseEnter={() => setIsMenu(true)}
                onMouseLeave={() => setIsMenu(false)}
              >
                <div className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center">
                  <motion.img
                    className="w-full h-full object-cover"
                    src={user?.photoURL || user?.picture || Avatar}
                    whileHover={{ scale: 1.15 }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {isMenu && (
                  <motion.div
                    {...slideTop}
                    className="px-6 py-4 w-52 bg-lightOverlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
                  >
                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/admin/dashboard/home"}
                    >
                      Dashboard
                    </Link>
                    <hr />
                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/profile"}
                    >
                      My Profile
                    </Link>
                    <hr />
                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/user-orders"}
                    >
                      Orders
                    </Link>
                    <hr />
                    <Link
                      className="hover:text-red-500 text-xl text-textColor"
                      to={"/change-password"}
                    >
                      Change Password
                    </Link>
                    <hr />
                    <motion.div
                      {...buttonClick}
                      onClick={signOut}
                      className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                    >
                      <MdLogout className="text-2xl text-textColor group-hover:text-headingColor" />
                      <p className="text-textColor text-xl group-hover:text-headingColor">
                        Sign Out
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            ) : (
              <NavLink to={"/login"}>
                <motion.button
                  {...buttonClick}
                  className="px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer"
                >
                  Login
                </motion.button>
              </NavLink>
            )}
          </nav>
        </header>

        <div className="flex flex-1 justify-between items-center gap-20 px-28">
          <div className="flex flex-col">
            <h1 className="text-4xl font-light text-headingColor">404</h1>
            <strong className="text-6xl font-bold">Lost in Space</strong>
            <hr className="w-28 h-1 bg-primaryColor border-none mt-6" />
            <div className="mt-12 text-xl">
              <p>You have reached the edge of the universe.</p>
              <p>The page you requested could not be found.</p>
              <p>Don't worry and return to the previous page.</p>
            </div>
            <div className="mt-10">
              <button
                className="rounded-full uppercase bg-primaryColor py-4 px-10 text-white text-base mr-10 ml-2 leading-5"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
              <button
                className="rounded-full uppercase border-primaryColor border-2 text-primaryColor py-4 px-10 text-base mx-2 leading-5"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              className="img relative -top-16"
              src={Astronaut}
              alt="Astronaut"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
