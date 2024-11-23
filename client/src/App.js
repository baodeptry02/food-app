import React, { useEffect, useState, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import {
  ChangePassword,
  Dashboard,
  Login,
  Main,
  MainTest,
  NotFound,
  ResetPassword,
  Service,
  Menu,
  Me,
} from './containers';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import LoadingAnimation from './animations/loading-animation';
import Header from './components/Header';
import { app } from './config/firebase.config';
import { getAuth } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './context/actions/userActions';
import LocomotiveScroll from 'locomotive-scroll';
import Footer from './components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Chatbot } from './components';
import { getAllProducts } from './api/productApi';
import { setProducts } from './context/actions/productActions';
import { getCartByUser } from './api/cartApi';
import { setCart } from './context/actions/cartAction';

gsap.registerPlugin(ScrollTrigger);
const App = () => {
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const auth = getAuth(app);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('');
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const locomotiveScroll = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        dispatch(setProducts(res));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      locomotiveScroll.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 1.5,
        class: 'is-reveal',
      });

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
      if (location.pathname !== '/') {
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

  // mouse cursor
  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     gsap.to(cursor.current, {
  //       x: e.clientX,
  //       y: e.clientY,
  //       duration: 0.1,
  //     });
  //   };

  //   scrollRef.current.addEventListener("mousemove", handleMouseMove);

  //   // Create a ScrollTrigger instance to update the cursor position on scroll
  //   // ScrollTrigger.create({
  //   //   onUpdate: (self) => {
  //   //     const { x, y } = self;
  //   //     gsap.to(cursor.current, {
  //   //       x: x + window.scrollX,
  //   //       y: y + window.scrollY,
  //   //       duration: 0.1,
  //   //     });
  //   //   },
  //   // });

  //   return () => {
  //     scrollRef.current.removeEventListener("mousemove", handleMouseMove);
  //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  //   };
  // }, []);

  useEffect(() => {
    setCurrentPath(location.pathname);

    const authToken = Cookies.get('authToken');
    if (authToken) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        dispatch(setUserDetails(userData));
        try {
          const fetchCart = async () => {
            const cart = await getCartByUser(userData.uid);
            dispatch(setCart(cart));
          };
          fetchCart();
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      }
    }
  }, [location.pathname, dispatch]);

  const hideHeaderRoutes = ['/login', '/admin'];

  const validRoutes = [
    '/',
    '/login',
    '/change-password',
    '/reset-password',
    '/admin',
    '/about',
    '/contact',
    '/menu',
    '/services',
    '/me/profile',
    '/me/cart',
  ];

  const isNotFoundRoute = !validRoutes.includes(location.pathname);

  const shouldHideHeader =
    hideHeaderRoutes.includes(location.pathname) || isNotFoundRoute;

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="w-screen min-h-screen h-auto relative dark:bg-[#121212]"
    >
      {/* <div
        ref={cursor}
        className="h-[4vw] w-[4vw] rounded-full border border-black transform -translate-x-1/2 -translate-y-1/2 z-50 absolute pointer-events-none bg-transparent"
      ></div> */}
      <ToastContainer
        transition={Slide}
        autoClose={2000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
      {loading && location.pathname !== '/' && <LoadingAnimation />}
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
          <Chatbot />
          <Routes>
            <Route path="/*" element={<NotFound />} />
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/dashboard/*" element={<Dashboard />} />
            <Route path="/services" element={<Service />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/me/*" element={<Me />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
