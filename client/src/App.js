import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  ChangePassword,
  Dashboard,
  Login,
  Main,
  NotFound,
  ResetPassword,
  Test,
  VerifyEmail,
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
import { Bubbles } from "./components";
import { Canvas } from "@react-three/fiber";

const App = () => {
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const auth = getAuth(app);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      userRef.current = currentUser;
    });

    const handleLoading = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

  const hideHeaderRoutes = [
    "/login",
    "/change-password",
    "/reset-password",
    "/admin",
  ];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const isNotFoundRoute =
    location.pathname !== "/" &&
    !hideHeaderRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="w-screen min-h-screen h-auto relative">
      <ToastContainer
        transition={Slide}
        autoClose={2000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
      {loading && <LoadingAnimation />}
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
