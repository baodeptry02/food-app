import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../assests';
import Lottie from 'lottie-react';
import Facebook from '../animations/Facebook-Icon.json';
import Twitter from '../animations/Twitter-Icon.json';
import Email from '../animations/Email.json';
import Gihub from '../animations/Gihub.json';

const Footer = () => {
  const localtion = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveringIcons, setHoveringIcons] = useState({
    facebook: false,
    twitter: false,
    email: false,
    github: false,
  });

  const handleMouseEnter1 = (icon) => {
    setHoveringIcons((prev) => ({ ...prev, [icon]: true }));
  };

  const handleMouseLeave = (icon) => {
    setHoveringIcons((prev) => ({ ...prev, [icon]: false }));
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
    <div>
      <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl xl:max-w-[70%]">
          <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
              <div className="logo flex items-center cursor-pointer">
                <img className="w-auto h-9" src={Logo} alt="" />
                <p
                  onMouseEnter={handleMouseEnter}
                  onAnimationEnd={handleAnimationEnd}
                  className={`app-name font-semibold text-3xl tracking-[8px] font-dancing mx-4 ${
                    isAnimating ? 'animate' : ''
                  }`}
                >
                  <svg
                    height="40"
                    width="200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <text
                      x="5"
                      y="30"
                      fill="none"
                      stroke="black"
                      className="dark:stroke-white transition-colors duration-500 ease-in-out"
                      fontSize="35"
                    >
                      City!
                    </text>
                  </svg>
                </p>
              </div>

              <p className="text-base leading-relaxed text-gray-600 mt-7">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
              </p>

              <ul className="flex items-center space-x-3 mt-9">
                <li>
                  <div
                    onClick={() =>
                      window.open('https://t.me/dbao0312', '_blank')
                    }
                    title=""
                    className="cursor-pointer flex items-center justify-center text-white transition-all duration-200 w-12 h-12"
                  >
                    <Lottie animationData={Twitter} autoPlay loop />
                  </div>
                </li>

                <li>
                  <div
                    onClick={() =>
                      window.open(
                        'https://www.facebook.com/baodeptry03',
                        '_blank'
                      )
                    }
                    title=""
                    className="cursor-pointer flex items-center justify-center text-white transition-all duration-200 w-12 h-12"
                  >
                    <Lottie animationData={Facebook} autoPlay loop />
                  </div>
                </li>

                <li>
                  <div
                    onMouseEnter={() => handleMouseEnter1('email')}
                    onMouseLeave={() => handleMouseLeave('email')}
                    onClick={() =>
                      (window.location.href = 'mailto:your-email@example.com')
                    }
                    className="cursor-pointer flex items-center justify-center w-12 h-12"
                  >
                    <Lottie
                      animationData={Email}
                      loop={hoveringIcons.email}
                      autoplay={hoveringIcons.email}
                    />
                  </div>
                </li>
                {/* Github Icon */}
                <li>
                  <div
                    onMouseEnter={() => handleMouseEnter1('github')}
                    onMouseLeave={() => handleMouseLeave('github')}
                    onClick={() => window.open('https://github.com', '_blank')}
                    className="cursor-pointer flex items-center justify-center w-12 h-12 ml-2"
                  >
                    <Lottie
                      animationData={Gihub}
                      loop={hoveringIcons.github}
                      autoplay={hoveringIcons.github}
                    />
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Company
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <div
                    onClick={() => navigate('/about')}
                    title=""
                    className="flex text-base text-black cursor-pointer transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    About{' '}
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => (window.location.href = '/about')}
                    title=""
                    className="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Contact{' '}
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => (window.location.href = '/about')}
                    title=""
                    className="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Works{' '}
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => (window.location.href = '/about')}
                    title=""
                    className="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Career{' '}
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Help
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <div
                    title=""
                    className="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Customer Support{' '}
                  </div>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Delivery Details{' '}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Terms & Conditions{' '}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {' '}
                    Privacy Policy{' '}
                  </a>
                </li>
              </ul>
            </div>

            {localtion.pathname === '/' ? (
              <div>
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                  Our Location
                </p>
                <iframe
                  className="space-y-4 mt-6"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.163889733436!2d106.7981483745761!3d10.875136457366162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1731383010706!5m2!1svi!2s"
                  width="320"
                  height="240"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            ) : (
              <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                  Subscribe to newsletter
                </p>
                <form action="#" method="POST" className="mt-6">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-primaryColor caret-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-primaryColor rounded-md hover:bg-red-700 focus:bg-red-700"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            )}
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <p className="text-sm text-center text-gray-600">
            © Copyright 2024, All Rights Reserved by Baodeptry02
          </p>
        </div>
      </section>
    </div>
  );
};

export default Footer;
