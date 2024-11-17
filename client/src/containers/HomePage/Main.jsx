import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FoodVideo } from "../../assests/index";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextSplitter from "../AnimatedTextSplitter";
import { Delivery, RamSay } from "../../assests";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";
import Lenis from "@studio-freight/lenis";
import _ from "lodash";
import { getAllProducts } from "../../api/productApi";
import { LuMouse } from "react-icons/lu";
import Typed from "typed.js";
import { IoPricetags } from "react-icons/io5";

export default function Main() {
  const videoRef = useRef();
  const textRef = useRef();
  const container = useRef();
  const container1 = useRef();
  const [showText, setShowText] = useState(false);
  const section2Ref = useRef();
  const titleRef = useRef();
  const ramsay = useRef();
  const titleHightLightRef = useRef();
  const banner = useRef();
  const welcomeRef = useRef();
  const description = useRef();
  const order = useRef();
  const typedElement = useRef();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 6 });
    const counter3 = document.querySelector(".counter-3");
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 10; j++) {
        const num = document.createElement("div");
        num.className = "num";
        num.textContent = j;
        counter3.appendChild(num);
      }
    }
    const finalDiv = document.createElement("div");
    finalDiv.className = "num";
    finalDiv.textContent = "0";
    counter3.appendChild(finalDiv);

    function animate(counter, duration, delay = 0) {
      const numHeight = counter.querySelector(".num").clientHeight;
      const totalDistance =
        (counter.querySelectorAll(".num").length - 1) * numHeight;

      gsap.to(counter, {
        duration: duration,
        y: -totalDistance,
        delay: delay,
        ease: "power2.inOut",
      });
    }
    animate(counter3, 3);
    animate(document.querySelector(".counter-2"), 3);
    animate(document.querySelector(".counter-1"), 1, 2);
    gsap.to(".digit", {
      top: "-150px",
      stagger: {
        amount: 0.25,
      },
      delay: 3,
      duration: 1,
      ease: "power4.inOut",
    });
    gsap.from(".loader-1", {
      width: 0,
      duration: 3,
      ease: "power2.inOut",
    });
    gsap.from(".loader-2", {
      width: 0,
      delay: 1.9,
      duration: 1.5,
      ease: "power2.inOut",
    });
    gsap.to(".loader", {
      background: "none",
      delay: 3,
      duration: 0.1,
    });
    gsap.to(".loader-1", {
      rotate: 90,
      y: -50,
      duration: 0.5,
      delay: 3,
    });
    gsap.to(
      ".loader-2",
      {
        x: -75,
        y: 75,
        duration: 0.5,
      },
      "<"
    );
    gsap.to(".loader", {
      scale: 40,
      duration: 1,
      delay: 4,
      ease: "power2.inOut",
    });
    gsap.to(".loader", {
      rotate: 45,
      y: 800,
      x: 2100,
      duration: 1,
      delay: 4,
      ease: "power2.inOut",
    });
    gsap.to(".loading-screen", {
      opacity: 0,
      duration: 1,
      delay: 5,
      onComplete: () => {
        document.querySelector(".loading-screen").style.display = "none";
      },
    });
    tl.fromTo(
      ".video-element",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      }
    );
    tl.to(
      ".block",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        stagger: {
          amount: 0.5,
          from: "random",
          ease: "power3.out",
        },
        onComplete: () => setShowText(true),
      },
      "<"
    );
  }, []);

  useEffect(() => {
    if (showText && textRef.current) {
      gsap.from(textRef.current.querySelectorAll(".split-char"), {
        y: -100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "power2.inOut",
      });
    }
  }, [showText]);
  useEffect(() => {
    if (titleHightLightRef.current) {
      gsap.fromTo(
        titleHightLightRef.current.querySelectorAll(".split-char"),
        {
          scale: 1.3,
          y: 40,
          rotate: -25,
          opacity: 0,
        },
        {
          scale: 1,
          y: 0,
          rotate: 0,
          opacity: 1,
          stagger: 0.5,
          ease: "back.out(3)",
          duration: 0.5,
        }
      );
    }
  }, []);

  useEffect(() => {
    const pin = ScrollTrigger.create({
      trigger: videoRef.current,
      start: "top top",
      endTrigger: section2Ref.current,
      end: "top top",
      pin: false,
      pinSpacing: false,
    });

    const scrollAnimation = gsap.fromTo(
      videoRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onLeave: () => {
            setShowText(false); // Hides text on leaving
          },
          onEnterBack: () => {
            setShowText(true); // Shows text on scrolling back
          },
        },
      }
    );

    return () => {
      pin.kill();
      scrollAnimation.scrollTrigger?.kill();
    };
  }, []);

  useEffect(() => {
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section2Ref.current,
        start: "30% center",
        end: "65% center",
        scrub: false,
        anticipatePin: 1,
        toggleActions: "play reverse play reverse",
        markers: true,
      },
    });
    titleTimeline.fromTo(
      ramsay.current,
      { opacity: 0, scale: 3 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power4.inOut",
      }
    );
    titleTimeline.fromTo(
      welcomeRef.current.querySelectorAll(".split-char"),
      {
        y: 115,
        opacity: 0,
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        stagger: 0.02,
        ease: "back.out(3)",
        duration: 0.5,
        lineHeight: 5.9,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      }
    );
    titleTimeline.call(() => {
      const chars = welcomeRef.current.querySelectorAll(".split-char");
      chars.forEach((char) => {
        char.style.transform = "none"; // Xóa mọi dịch chuyển
        char.style.lineHeight = "normal"; // Reset line-height về mặc định
        char.style.clipPath = "none"; // Reset clip-path
      });
    });

    titleTimeline.fromTo(
      banner.current,
      { opacity: 0, x: -50 },
      {
        opacity: 2,
        x: 0,
        duration: 0.2,
        ease: "power4.inOut",
      }
    );

    titleTimeline.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { y: 0, opacity: 1, duration: 0.2, ease: "power4.inOut" }
    );
    titleTimeline.fromTo(
      titleHightLightRef.current.querySelectorAll(".split-char"),
      {
        scale: 1.3,
        y: 40,
        rotate: -25,
        opacity: 0,
      },
      {
        scale: 1,
        y: 0,
        rotate: 0,
        opacity: 1,
        stagger: 0.05,
        ease: "back.out(3)",
        duration: 0.2,
      }
    );
    titleTimeline.fromTo(
      description.current,
      { opacity: 0, y: -50 },
      {
        opacity: 2,
        y: 0,
        duration: 0.2,
        ease: "power4.inOut",
      }
    );
    titleTimeline.fromTo(
      order.current,
      { opacity: 0, y: 100 },
      {
        opacity: 2,
        y: 0,
        duration: 0.2,
        ease: "power4.inOut",
      }
    );
    return () => {
      titleTimeline.scrollTrigger.kill();
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) return;
    const imagePromises = Array.from(
      document.querySelectorAll(".gsap__item img")
    ).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    });

    Promise.all(imagePromises).then(() => {
      const lenis = new Lenis({
        duration: 1.2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      const initScrollTrigger = () => {
        const gsapBlWidth = document.querySelector(".gsap__bl").offsetWidth;
        const gsapTrackWidth =
          document.querySelector(".gsap__track").offsetWidth;
        const scrollSliderTransform = gsapTrackWidth - gsapBlWidth;

        gsap.to(".gsap__track", {
          scrollTrigger: {
            trigger: ".gsap_slider",
            start: "center center",
            end: () => `+=${gsapTrackWidth}`,
            pin: true,
            scrub: true,
          },
          x: `-=${scrollSliderTransform}px`,
        });
      };
      initScrollTrigger();

      const debouncedResize = _.debounce(() => {
        ScrollTrigger.refresh();
      }, 500);
      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        gsap.ticker.remove((time) => lenis.raf(time * 1000));
      };
    });
  }, [loading]);

  useEffect(() => {
    const options = {
      strings: ["Breads", "Deserts", "Drinks", "Snacks"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 400,
      loop: true,
    };

    const typed = new Typed(typedElement.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <main ref={container1} className="flex flex-col bg-primary">
        <section
          className="h-screen w-screen flex justify-center items-center overflow-hidden"
          ref={container}
        >
          <video
            ref={videoRef}
            src={FoodVideo}
            id="introVideo"
            className="video-element w-full object-cover overflow-hidden pointer-events-none opacity-0"
            autoPlay
            muted
            playsInline
            loop
            type="video/mp4"
          />
          {showText && (
            <div
              className="absolute text-white text-6xl uppercase tracking-10 font-poppins pointer-events-none"
              style={{
                WebkitTextStroke: "2px black",
                WebkitTextFillColor: "white",
              }}
            >
              <AnimatedTextSplitter
                ref={textRef}
                className="text"
                text="FoodAppee"
              />
            </div>
          )}
        </section>

        <div className="fixed top-0 left-0 w-full h-screen flex pointer-events-none">
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
        </div>
        <div class="z-20 loading-screen fixed w-full h-full top-0 left-0 bg-black text-white pointer-events-none">
          <div class="loader absolute top-1/2 left-1/2 w-[300px] h-[50px] -translate-x-1/2 -translate-y-1/2 flex bg-[rgb(80,80,80)]">
            <div class="loader-1 bar relative bg-white w-[200px] h-[50px]"></div>
            <div class="loader-2 bar relative bg-white w-[100px] h-[50px]"></div>
          </div>
          <div class="font-normal counter fixed left-[50px] bottom-[50px] flex h-[100px] text-[100px] leading-[102px] clip-path-custom1">
            <div class="counter-1 digit relative -top-[15px]">
              <div class="num">0</div>
              <div class="num num1offset1 relative -right-2">1</div>
            </div>
            <div class="counter-2 digit relative -top-[15px]">
              <div class="num">0</div>
              <div class="num num1offset2 relative -right-[10px]">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
              <div class="num">6</div>
              <div class="num">7</div>
              <div class="num">8</div>
              <div class="num">9</div>
              <div class="num">0</div>
            </div>
            <div class="counter-3 digit relative top-[-15px]">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
              <div class="num">6</div>
              <div class="num">7</div>
              <div class="num">8</div>
              <div class="num">9</div>
            </div>
          </div>
        </div>
        {/* <section className="gradient"></section> */}
        <section
          ref={section2Ref}
          className="hero w-full flex justify-center flex-col items-start pt-8 h-screen dark:bg-darkBg bg-primary px-6 md:px-24 2xl:px-96 gap-12 pb-24 lg:pb-0 transition-colors duration-500 ease-in-out"
        >
          {/* <div className="end-lottie"></div> */}
          <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <p className="title text-lg font-semibold text-orange-500">
          <AnimatedTextSplitter text={text} />
        </p> */}
            <div className="flex flex-col items-start justify-center gap-6 lg:gap-3">
              <div
                ref={banner}
                className="mt-8 px-4 py-1 flex items-center justify-center gap-2 bg-orange-100 rounded-full dark:bg-orange-900 transition-colors duration-500 ease-in-out"
              >
                <p className="text-lg font-semibold text-orange-500 dark:text-orange-300 transition-colors duration-500 ease-in-out">
                  Free delivery
                </p>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary shadow-md">
                  <img
                    className=" w-full h-full object-contain"
                    src={Delivery}
                    alt=""
                  />
                </div>
              </div>
              <div>
                <p className=" font-poppins text-6xl text-red-700 dark:text-red-300 mt-8 lg:mt-4 font-semibold tracking-wider transition-colors duration-500 ease-in-out">
                  <AnimatedTextSplitter
                    ref={welcomeRef}
                    className="text"
                    text="Welcome to Food City"
                  />
                </p>
              </div>
              <p
                ref={titleRef}
                className="text-[40px] text-headingColor lg:text-[54px] md:text-[72px] font-sans font-extrabold tracking-wider dark:text-white transition-colors duration-500 ease-in-out"
              >
                The Fastest Delivery in
                <div ref={titleHightLightRef} className="text-orange-600">
                  <AnimatedTextSplitter
                    ref={titleHightLightRef}
                    className="text"
                    text="Your city"
                  />
                </div>
              </p>
              <p
                ref={description}
                className="text-textColor text-lg dark:text-white transition-colors duration-500 ease-in-out"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
                omnis iusto ad cupiditate exercitationem veniam, ipsa
                laboriosam. Aliquam enim, repellendus quia unde, inventore
                adipisci rem delectus repellat eum rerum nisi.
              </p>
              <motion.button
                ref={order}
                {...buttonClick}
                className="mt-8 bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold dark:text-white transition-colors duration-500 ease-in-out"
              >
                Order Now
              </motion.button>
            </div>
            <div
              ref={ramsay}
              className=" py-2 flex-1 flex items-center justify-end relative"
            >
              <img
                className="absolute right-0 md:-right-12 w-auto h-auto md:w-auto md:h-[540px] xl:h-[650px] bg-center bg-cover object-cover"
                src={RamSay}
                alt=""
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
          </motion.div>
        </section>
        {/* <div className="h-auto bg-gradient-to-r from-[#E90000] to-[#faa6ff] text-[#ff7973]"> */}
        <div className="h-auto bg-[#fdebec] text-[#ff7973] pb-3 dark:bg-darkBg transition-colors duration-500 ease-in-out">
          <div className="text-[68px] font-bold capitalize font-[lobster] flex justify-center items-center p-8 relative">
            <span className="text-shadow-md shadow-black transition duration-300 hover:text-[#E90000] dark:text-[#FF5733] ">
              Our Best Seller
            </span>
            <div className="absolute bottom-[-10px] w-16 h-[4px] bg-yellow-500 animate-pulse rounded-full"></div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-lg font-medium mt-12 animate-bounce text-black">
            <LuMouse className="text-[#ff7973] font-bold text-2xl animate-bounce transition-transform duration-500 transform hover:scale-125" />
            <span className="text-[#ff7973] font-bold text-2xl transition duration-300 hover:text-[#E90000]">
              Scroll down to see more
            </span>
          </div>
        </div>

        <section className="dark:bg-darkBg  transition-colors duration-500 ease-in-out wrapp w-screen h-[150vh] overflow-hidden relative pt-[120px] box-border">
          <div className="pl-36 xl:block hidden  z-10 font-bold text-4xl text-black dark:text-primary">
            We have{" "}
            <span
              className="text-primaryColor dark:text-[#FF5733]"
              ref={typedElement}
            ></span>{" "}
            in our menu
          </div>
          <main className="main">
            <section className="section-slider gsap_slider">
              <div className="content">
                <div className="section__slider gsap_h">
                  <div className="gsap__bl">
                    <div className="gsap__inner">
                      <div className="gsap__track relative">
                        {loading ? (
                          <div>Loading...</div>
                        ) : (
                          products?.map((product, index) => (
                            <div
                              className="gsap__item my-auto !h-[90%] xl:!h-[100%] relative rounded-lg"
                              key={index}
                            >
                              <img
                                className="rounded-lg w-full h-full object-cover"
                                src={product.imageDownloadUrl}
                                alt={product.itemName}
                              />
                              <div className="absolute h-[inherit] top-0 z-10 left-[10%] text-white flex flex-col justify-around items-start gap-12 my-auto">
                                <div>
                                  <h2 className="text-4xl">
                                    {product.itemName}
                                  </h2>
                                </div>
                              </div>
                              <div className="absolute z-10 flex items-center justify-between w-full bg-opacity-50 py-8 rounded-md bottom-4 px-20">
                                <button className="button-buy-now px-6 py-3 bg-transparent border-2 text-white font-roboto font-bold uppercase text-base rounded-xl">
                                  Buy Now
                                </button>
                                <p className="text-base px-6 py-3 font-bold flex items-center gap-2 backdrop-blur-md rounded-full border-2 text-primaryColor">
                                  <IoPricetags className="text-primaryColor" />{" "}
                                  <span>${product.price}</span>
                                </p>
                              </div>
                              <span className="gsap__item-img">
                                <img
                                  src={product.imageDownloadUrl}
                                  alt={product.itemName}
                                />
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="section-text">
              <div class="content">
                <p className="description-content">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos
                  voluptatem fugit accusamus fuga vero quos, sint est laboriosam
                  eveniet ea! Ducimus illum hic quas dolorem minima eius?
                  Laboriosam iure deserunt totam sequi atque porro, dignissimos
                  dolore sed laudantium. Ducimus modi corporis quaerat autem
                  voluptates, quis, facere minima sequi reprehenderit itaque
                  tempore illum perspiciatis delectus maiores! Aliquam placeat
                  necessitatibus omnis voluptatem molestias repellat repudiandae
                  quia ad quas, in accusantium, est enim esse quidem illo
                  dolorem! Dolor, quam voluptatem! Facilis voluptatem tempore
                  repellat accusamus quidem illo molestias odio, consequuntur
                  rem mollitia dolores praesentium quisquam accusantium quo?
                </p>
              </div>
            </section>
          </main>
        </section>
      </main>
    </div>
  );
}
