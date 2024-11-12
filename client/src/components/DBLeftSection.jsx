import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "../assests";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles.utils";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { IoMoonOutline } from "react-icons/io5";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";

const DBLeftSection = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkTheme(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newTheme);
      return newTheme;
    });
  };
  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsAnimating(true);
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div className="h-full py-12 flex flex-col bg-lightOverlay dark:bg-darkBg backdrop-blur-md shadow-md min-w-210 w-300 gap-3 transition-colors duration-500 ease-in-out">
      <NavLink to={"/"} className="flex items-center justify-start px-6 gap-4">
        <img src={Logo} className="w-12" alt="" />
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
      <hr className="dark:border-darkOverlay-300 transition-colors duration-500 ease-in-out" />

      <ul className="flex flex-col gap-4 flex-grow">
        <NavLink
          to={"/admin/dashboard/home"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500  transition-colors duration-500 ease-in-out`
              : `${isNotActiveStyles} px-4 py-2 dark:text-darkTextColor transition-colors duration-500 ease-in-out`
          }
        >
          Home
        </NavLink>
        <NavLink
          to={"/admin/dashboard/orders"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500  transition-colors duration-500 ease-in-out`
              : `${isNotActiveStyles} px-4 py-2 dark:text-darkTextColor transition-colors duration-500 ease-in-out`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to={"/admin/dashboard/items"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500  transition-colors duration-500 ease-in-out`
              : `${isNotActiveStyles} px-4 py-2 dark:text-darkTextColor transition-colors duration-500 ease-in-out`
          }
        >
          Items
        </NavLink>
        <NavLink
          to={"/admin/dashboard/newItem"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-600  transition-colors duration-500 ease-in-out`
              : `${isNotActiveStyles} px-4 py-2 dark:text-darkTextColor transition-colors duration-500 ease-in-out`
          }
        >
          Add New Item
        </NavLink>
        <NavLink
          to={"/admin/dashboard/users"}
          className={({ isActive }) =>
            isActive
              ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500  transition-colors duration-500 ease-in-out`
              : `${isNotActiveStyles} px-4 py-2 dark:text-darkTextColor transition-colors duration-500 ease-in-out`
          }
        >
          Users
        </NavLink>
      </ul>

      <hr className="dark:border-darkOverlay-300 transition-colors duration-500 ease-in-out" />
      <div className="text-2xl text-textColor dark:text-white w-full flex items-center p-6 justify-between transition-colors duration-500 ease-in-out">
        <div>Theme</div>
        <div className="flex items-center gap-4">
          {isDarkTheme ? (
            <IoMoonOutline className="text-2xl dark:text-white transition-colors duration-500 ease-in-out" />
          ) : (
            <MdOutlineLightMode className="text-2xl text-dark " />
          )}
          <motion.div
            {...buttonClick}
            className="flex items-center justify-center p-2"
          >
            <label
              htmlFor="theme-toggle"
              className="relative inline-flex items-center"
            >
              <input
                type="checkbox"
                id="theme-toggle"
                className="sr-only peer"
                checked={isDarkTheme}
                onChange={toggleTheme}
              />
              <div className="cursor-pointer w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 transition-colors duration-500 ease-in-out"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 transition-colors duration-500 ease-in-out"></span>
            </label>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DBLeftSection;
