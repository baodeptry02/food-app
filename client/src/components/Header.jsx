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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkTheme(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);
  useGSAP(
    () => {
      gsap.set(".navlink", { opacity: 1, y: 0 });
      gsap.set(".logo", { opacity: 1, y: 0 });

      gsap.from(".logo", {
        duration: 1,
        opacity: 0,
        y: -100,
        rotate: 360,
      });
      gsap.from(
        ".navlink",
        {
          duration: 1.5,
          opacity: 0,
          y: -50,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=1.35"
      );
    },
    { scope: headerRef }
  );

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
      className="fixed backdrop-blur-md z-0 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6"
    >
      {isLoading && <LoadingAnimation />}
      <NavLink
        to={"/"}
        className="logo flex items-center justify-center gap-4 opacity-0 "
      >
        <img src={Logo} className="w-12" alt="Logo" />
        <p className="font-semibold text-xl">City</p>
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
  );
};

export default Header;
