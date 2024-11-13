import React, { useEffect, useRef, useState } from "react";
import {
  MdLightMode,
  MdLogout,
  MdOutlineLightMode,
  MdShoppingCart,
} from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Logo } from "../assests";
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

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);
  const [isMenu, setIsMenu] = useState(false);
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const headerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const appNameRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkTheme(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);
  useGSAP(
    () => {
      const isHomePage = location.pathname === "/";
      const delay = isHomePage ? 5 : 1.5;

      gsap.set(".logo", { opacity: 1, y: 0 });
      gsap.set(".navlink", { opacity: 1, y: 0 });

      gsap.from(".logo", {
        duration: 1,
        opacity: 0,
        y: -100,
        rotate: 360,
        delay: delay,
      });

      gsap.from(".navlink", {
        duration: 1.5,
        opacity: 0,
        y: -50,
        stagger: 0.2,
        ease: "power3.out",
        delay: delay + 0.5,
      });
    },
    { scope: headerRef }
  );

  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

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

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newTheme);
      return newTheme;
    });
  };

  return (
    <header
      ref={headerRef}
      className="fixed z-10 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6 backdrop-blur-md"
    >
      {isLoading && <LoadingAnimation />}
      <NavLink
        to={"/"}
        className="logo flex items-center justify-center gap-4 opacity-0"
      >
        <img src={Logo} className="w-12" alt="Logo" />
        <p
          onMouseEnter={handleMouseEnter}
          onAnimationEnd={handleAnimationEnd}
          className={`app-name font-semibold text-3xl tracking-[8px] font-dancing mx-4 ${
            isAnimating ? "animate" : ""
          }`}
        >
          <svg height="40" width="200" xmlns="http://www.w3.org/2000/svg">
            <text
              x="5"
              y="30"
              fill="none"
              stroke="black"
              className="dark:stroke-white transition-colors duration-500 ease-in-out"
              fontSize="35"
            >
              City
            </text>
          </svg>
        </p>
      </NavLink>

      <nav className="flex items-center justify-center gap-8">
        <ul className="hidden md:flex items-center justify-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${isActiveStyles} navlink opacity-0 `
                : `${isNotActiveStyles} navlink opacity-0 dark:text-slate-50 transition-colors duration-500 ease-in-out`
            }
            to={"/"}
          >
            Home
            <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-current transition-all duration-300 ease-out transform -translate-x-1/2 navlink-line"></span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${isActiveStyles} navlink opacity-0 `
                : `${isNotActiveStyles} navlink opacity-0 dark:text-slate-50  transition-colors duration-500 ease-in-out`
            }
            to={"/menu"}
          >
            Menu
            <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-current transition-all duration-300 ease-out transform -translate-x-1/2 navlink-line"></span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${isActiveStyles} navlink opacity-0 `
                : `${isNotActiveStyles} navlink opacity-0 dark:text-slate-50  transition-colors duration-500 ease-in-out`
            }
            to={"/services"}
          >
            <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-current transition-all duration-300 ease-out transform -translate-x-1/2 navlink-line"></span>
            Services
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? `${isActiveStyles} navlink opacity-0 `
                : `${isNotActiveStyles} navlink opacity-0 dark:text-slate-50  transition-colors duration-500 ease-in-out`
            }
            to={"/aboutus"}
          >
            <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-current transition-all duration-300 ease-out transform -translate-x-1/2 navlink-line"></span>
            About Us
          </NavLink>
        </ul>

        <motion.div
          {...buttonClick}
          onClick={() => dispatch()}
          className="relative cursor-pointer navlink"
        >
          <MdShoppingCart className="text-3xl text-textColor dark:text-slate-50 dark:hover:text-red-700 transition-colors duration-500 ease-in-out" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-2">
            <p className="text-primary text-base font-semibold">2</p>
          </div>
        </motion.div>

        <div className="px-6">
          <motion.div
            {...buttonClick}
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full bg-gray-300 p-2 cursor-pointer navlink"
          >
            {isDarkTheme ? (
              <IoMoonOutline className="text-3xl text-dark" />
            ) : (
              <MdOutlineLightMode className="text-3xl text-dark" />
            )}
          </motion.div>
        </div>

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
                className="px-6 py-4 w-52 bg-lightOverlay dark:bg-darkOverlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4 transition-colors duration-500 ease-in-out"
              >
                <Link
                  className="text-xl text-textColor dark:text-slate-50 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-500 ease-in-out"
                  to={"/admin/dashboard/home"}
                >
                  Dashboard
                </Link>
                <hr />
                <Link
                  className="text-xl text-textColor dark:text-slate-50 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-500 ease-in-out"
                  to={"/profile"}
                >
                  My Profile
                </Link>
                <hr />
                <Link
                  className="text-xl text-textColor dark:text-slate-50 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-500 ease-in-out"
                  to={"/user-orders"}
                >
                  Orders
                </Link>
                <hr />
                <Link
                  className="text-xl text-textColor dark:text-slate-50 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-500 ease-in-out"
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
              className="px-4 py-2 rounded-md shadow-md bg-lightOverlay dark:bg-darkOverlay dark:text-slate-50 border border-red-300 cursor-pointer navlink transition-colors duration-500 ease-in-out"
            >
              Login
            </motion.button>
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;
