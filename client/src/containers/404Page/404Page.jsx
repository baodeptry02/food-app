import React, { useEffect, useRef, useState } from "react";
import { MdLogout, MdShoppingCart } from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Logo, Astronaut } from "../../assests";
import { isActiveStyles, isNotActiveStyles } from "../../utils/styles.utils";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { buttonClick, slideTop } from "../../animations/index";
import { logoutUser } from "../../context/actions/userActions";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase.config";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/all";
import { FaFacebookF, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";

const NotFound = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);
  const [isMenu, setIsMenu] = useState(false);
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);
  const intervalRef = useRef(null);
  const generateRandomPath = (numPoints, maxX, maxY, maxZ) => {
    const path = [];
    for (let i = 0; i < numPoints; i++) {
      path.push({
        x: (Math.random() - 0.5) * maxX,
        y: (Math.random() - 0.5) * maxY,
        z: (Math.random() - 0.5) * maxZ,
      });
    }
    path.push({ ...path[0] });
    return path;
  };
  useGSAP(() => {
    gsap.set(".navlink", { opacity: 1 });
    gsap.set(".logo", { opacity: 1 });

    gsap.registerPlugin(MotionPathPlugin);

    gsap.to(".img", {
      duration: 200,
      repeat: -1,
      ease: "none",
      immediateRender: true,
      motionPath: {
        path: generateRandomPath(80, 100, 100, 100),
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
  const rain = () => {
    const cloud = document.querySelector(".container-1");
    const e = document.createElement("div");

    e.classList.add("star");
    cloud.appendChild(e);

    const left = Math.floor(Math.random() * (window.innerWidth - 200));
    const size = 10 + Math.floor(Math.random() * 20);
    const duration = 20 + Math.random() * 3;

    e.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.4 8.168L12 18.896l-7.334 3.864 1.4-8.168L.132 9.21l8.2-1.192z"/></svg>`;
    e.style.left = `${left}px`;
    e.style.top = `-50px`;
    e.style.fontSize = `${size}px`;
    e.style.color = `hsl(${Math.random() * 360}, 100%, 75%)`; // Random màu sắc

    setTimeout(() => {
      cloud.removeChild(e);
    }, duration * 1000);
  };

  useEffect(() => {
    intervalRef.current = setInterval(rain, 50);

    return () => clearInterval(intervalRef.current);
  }, []);
  return (
    <div className="container-1 h-screen flex justify-center items-center bg-slate-950 overflow-hidden w-screen">
      <div className="flex flex-col h-70% w-3/5 lg:w-3/4 lg:h-[85%] xl:h-2/3 rounded-3xl backdrop-blur-sm z-10 bg-galaxyOverlay">
        {/* Header */}
        <header className="text-primary flex items-center justify-between p-4 lg:py-0 mt-8 lg:mt-4 rounded-t-3xl px-28">
          <NavLink
            to={"/"}
            className="logo flex items-center justify-center gap-4 opacity-0 "
          >
            <img src={Logo} className="w-12" alt="Logo" />
            <p className="font-semibold text-xl text-primary">City</p>
          </NavLink>
          <nav className="flex items-center justify-center gap-8">
            <ul className="hidden md:flex items-center justify-center gap-16">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0`
                }
                to={"/"}
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0`
                }
                to={"/menu"}
              >
                Menu
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0`
                }
                to={"/services"}
              >
                Services
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${isActiveStyles} navlink opacity-0 `
                    : `${isNotActiveStyles} navlink opacity-0`
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
              <MdShoppingCart className="text-3xl text-primary" />
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
                    className="z-10 px-6 py-4 w-52 bg-lightOverlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
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

        <div className="flex flex-initial justify-between items-center gap-20 px-28">
          <div className="flex flex-col">
            <h1 className="text-4xl lg:text-3xl font-light text-primary">
              404
            </h1>
            <strong className="text-6xl font-bold text-primary">
              Lost in Space
            </strong>
            <hr className="w-28 h-1 bg-primaryColor border-none mt-6 text-primary" />
            <div className="mt-12 lg:mt-8 text-xl lg:text-lg text-primary font-roboto tracking-wide">
              <p>You have reached the edge of the universe.</p>
              <p className="lg:my-2">
                The page you requested could not be found.
              </p>
              <p>Don't worry and return to the previous page.</p>
            </div>
            <div className="mt-10">
              <button
                className="rounded-full uppercase bg-primaryColor py-4 px-10 lg:py-4 lg:px-8 text-primary text-base mr-10 ml-2 leading-5 font-semibold"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
              <button
                className="rounded-full uppercase border-primaryColor border-2 text-primaryColor py-4 px-10 text-lg mx-2 leading-5 font-extrabold"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
          <div className="relative w-460 h-420 top-2 pointer-events-none">
            <img
              className="img relative w-460 h-345"
              src={Astronaut}
              alt="Astronaut"
            />
          </div>
        </div>

        <footer className="mt-8 lg:mt-0 px-28 flex justify-between items-center">
          <div className="flex justify-between items-center gap-16 text-2xl text-red-700">
            <FaFacebookF />
            <FaTwitter />
            <FaTelegramPlane />
            <BiLogoInstagramAlt />
          </div>
          <div className="text-lg font-semibold text-primary">
            &copy; 2024 - All Right Reserved
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NotFound;
