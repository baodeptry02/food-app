import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  ChangePassword,
  Dashboard,
  Login,
  Main,
  MainTest,
  NotFound,
  ResetPassword,
} from "./containers";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

import LoadingAnimation from "./animations/loading-animation";
import Header from "./components/Header";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./context/actions/userActions";
import LocomotiveScroll from "locomotive-scroll";

const App = () => {
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const auth = getAuth(app);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const locomotiveScroll = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      locomotiveScroll.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 1.5, // Adjust speed if needed
        class: "is-reveal", // Custom class applied to elements when scrolled into view
      });

      // Clean up the locomotive scroll instance on component unmount
      return () => {
        if (locomotiveScroll.current) {
          locomotiveScroll.current.destroy();
        }
      };
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      userRef.current = currentUser;
    });

    const handleLoading = () => {
      if (location.pathname !== "/") {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    };

    handleLoading();

    return () => {
      unsubscribe();
    };
  }, [location.pathname]);

  useEffect(() => {
    setCurrentPath(location.pathname);

    const authToken = Cookies.get("authToken");
    if (authToken) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        dispatch(setUserDetails(userData));
      }
    }
  }, [location.pathname, dispatch]);

  const hideHeaderRoutes = ["/login", "/change-password", "/admin"];

  const validRoutes = [
    "/",
    "/login",
    "/change-password",
    "/reset-password",
    "/admin",
    "/about",
    "/contact",
    // Thêm các đường dẫn hợp lệ khác ở đây
  ];

  const isNotFoundRoute = !validRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="w-screen min-h-screen h-auto relative"
    >
      <ToastContainer
        transition={Slide}
        autoClose={2000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
      {loading && location.pathname !== "/" && <LoadingAnimation />}
      {/* {!loading && (
        <Canvas
          style={{
            position: "absolute", // Make Canvas cover the entire screen
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 100, // Place Canvas behind other components
          }}
        >
          <Bubbles />
        </Canvas>
      )} */}
      {!loading && (
        <>
          {!loading && !shouldHideHeader && !isNotFoundRoute && <Header />}
          <Routes>
            <Route path="/*" element={<NotFound />} />
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/dashboard/*" element={<Dashboard />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
