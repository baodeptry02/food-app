import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../assests";

const Footer = () => {
  const localtion = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

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
      <section class="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
        <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl xl:max-w-[70%]">
          <div class="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div class="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
              <div className="logo flex items-center cursor-pointer">
                <img class="w-auto h-9" src={Logo} alt="" />
                <p
                  onMouseEnter={handleMouseEnter}
                  onAnimationEnd={handleAnimationEnd}
                  className={`app-name font-semibold text-3xl tracking-[8px] font-dancing mx-4 ${
                    isAnimating ? "animate" : ""
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
                      City
                    </text>
                  </svg>
                </p>
              </div>

              <p class="text-base leading-relaxed text-gray-600 mt-7">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
              </p>

              <ul class="flex items-center space-x-3 mt-9">
                <li>
                  <div
                    onClick={() =>
                      window.open("https://t.me/dbao0312", "_blank")
                    }
                    title=""
                    class="cursor-pointer flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-primaryColor focus:bg-primaryColor"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.64 8.64l-1.92 9.12c-.14.64-.52.8-1.04.52l-2.88-2.12-1.4 1.36c-.16.16-.28.28-.56.28l.2-2.84 5.16-4.68c.24-.2-.04-.32-.36-.12l-6.36 4.04-2.72-.84c-.6-.2-.6-.6.12-.88l10.56-4.08c.48-.2.88.12.72.84z" />
                    </svg>
                  </div>
                </li>

                <li>
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/baodeptry03",
                        "_blank"
                      )
                    }
                    title=""
                    class="cursor-pointer flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-primaryColor focus:bg-primaryColor"
                  >
                    <svg
                      class="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                    </svg>
                  </div>
                </li>

                <li>
                  <div
                    onClick={() =>
                      (window.location.href = "mailto:aqaq03122003@gmail.com")
                    }
                    title="Email"
                    class="cursor-pointer flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-primaryColor focus:bg-primaryColor"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                </li>

                <li>
                  <div
                    onClick={() =>
                      window.open("https://github.com/baodeptry02", "_blank")
                    }
                    title=""
                    class="cursor-pointer flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-primaryColor focus:bg-primaryColor"
                  >
                    <svg
                      class="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                      ></path>
                    </svg>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Company
              </p>

              <ul class="mt-6 space-y-4">
                <li>
                  <div
                    onClick={() => navigate("/about")}
                    title=""
                    class="flex text-base text-black cursor-pointer transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    About{" "}
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => (window.location.href = "/about")}
                    title=""
                    class="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Contact{" "}
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => (window.location.href = "/about")}
                    title=""
                    class="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Works{" "}
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => (window.location.href = "/about")}
                    title=""
                    class="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Career{" "}
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Help
              </p>

              <ul class="mt-6 space-y-4">
                <li>
                  <div
                    title=""
                    class="flex text-base cursor-pointer text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Customer Support{" "}
                  </div>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    class="flex text-base text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Delivery Details{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    class="flex text-base text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Terms & Conditions{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    class="flex text-base text-black transition-all duration-200 hover:text-primaryColor focus:text-primaryColor"
                  >
                    {" "}
                    Privacy Policy{" "}
                  </a>
                </li>
              </ul>
            </div>

            {localtion.pathname === "/" ? (
              <div>
                <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase">
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
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            ) : (
              <div class="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
                <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                  Subscribe to newsletter
                </p>
                <form action="#" method="POST" className="mt-6">
                  <div>
                    <label for="email" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-primaryColor caret-blue-600"
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

          <hr class="mt-16 mb-10 border-gray-200" />

          <p class="text-sm text-center text-gray-600">
            © Copyright 2021, All Rights Reserved by Baodeptry02
          </p>
        </div>
      </section>
    </div>
  );
};

export default Footer;
