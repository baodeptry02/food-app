import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FoodVideo, KimJongUn } from "../../assests/index";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextSplitter from "../AnimatedTextSplitter";
import { Delivery, RamSay } from "../../assests";
import { motion } from "framer-motion";
import { buttonClick } from "../../animations";

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
  const section3Ref = useRef();

  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      img: "https://www.shutterstock.com/shutterstock/videos/1063352986/thumb/1.jpg?ip=x480",
      name: "Coca",
      category: "Drink",
      price: "1.5$",
    },
    {
      img: "https://i.ytimg.com/vi/fVWAy3dFWpU/maxresdefault.jpg",
      name: "Cheetos",
      category: "Snacks",
      price: "1.5$",
    },
    {
      img: "https://media.post.rvohealth.io/wp-content/uploads/sites/2/2022/05/567521-grt-bananas-1296x728-header_body.jpg",
      name: "Banana",
      category: "Fruits",
      price: "1.5$",
    },
    {
      img: "https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Hamburger",
      category: "Bread",
      price: "1.5$",
    },
    {
      img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Pancake",
      category: "Bread",
      price: "1.5$",
    },
    {
      img: "https://images.pexels.com/photos/990439/pexels-photo-990439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      name: "Strawberry Smoothie",
      category: "Drink",
      price: "1.5$",
    },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };
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
    console.log(titleHightLightRef.current.querySelectorAll(".split-char"));
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
      pin: true,
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

  const createTitleTimeline = () => {
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section2Ref.current,
        start: "top 20%",
        end: "90% 90%",
        scrub: 1,
        anticipatePin: 1,
        onEnter: () => titleTimeline.restart(true), // Restart the animation on re-entry
      },
    });

    titleTimeline.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { y: 0, opacity: 1, duration: 2, ease: "power4.inOut" }
    );
    titleTimeline.fromTo(
      titleHightLightRef.current.querySelectorAll(".split-char"),
      { scale: 1.3, y: 40, rotate: -25, opacity: 0 },
      {
        scale: 1,
        y: 0,
        rotate: 0,
        opacity: 1,
        stagger: 0.5,
        ease: "back.out(3)",
        duration: 3,
      }
    );
    titleTimeline.fromTo(
      welcomeRef.current.querySelectorAll(".split-char"),
      { scale: 1.3, y: 40, rotate: -25, opacity: 0 },
      {
        scale: 1,
        y: 0,
        rotate: 0,
        opacity: 1,
        stagger: 0.5,
        ease: "back.out(3)",
        duration: 3,
      }
    );
    titleTimeline.fromTo(
      ramsay.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 2, ease: "power4.inOut" }
    );
    titleTimeline.fromTo(
      banner.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 2, ease: "power4.inOut" }
    );
    titleTimeline.fromTo(
      description.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 2, ease: "power4.inOut" }
    );
    titleTimeline.fromTo(
      order.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 2, ease: "power4.inOut" }
    );

    return titleTimeline;
  };

  useEffect(() => {
    const titleTimeline = createTitleTimeline();

    return () => {
      titleTimeline.scrollTrigger.kill();
    };
  }, []);

  useEffect(() => {
    const pin = ScrollTrigger.create({
      trigger: section2Ref.current,
      start: "top top",
      endTrigger: section3Ref.current,
      end: "top top",
      pin: true,
      pinSpacing: false,
    });

    const scrollAnimation = gsap.fromTo(
      section2Ref.current,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onLEnterBack: () => createTitleTimeline(),
        },
      }
    );

    return () => {
      pin.kill();
      scrollAnimation.scrollTrigger?.kill();
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
            <div className="flex flex-col items-start justify-center gap-6">
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
                <p className=" font-poppins text-6xl text-red-700 dark:text-red-300 mt-8 font-semibold tracking-wider transition-colors duration-500 ease-in-out">
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

        <section
          ref={section3Ref}
          className="w-screen h-screen overflow-hidden relative pt-[120px] box-border"
        >
          <div>
            <div className="list">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-x-0 inset-y-0 transition-opacity duration-500 ${
                    index === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={item.img}
                    alt={item.name}
                  />
                  <div className="absolute top-[40%] w-[1140px] max-w-[80%] left-1/2 -translate-x-1/2 box-border text-white pr-[30%]">
                    <div className="text-4xl mb-5">
                      Product Name: {item.name}
                    </div>
                    <div className="text-3xl mb-5">
                      Category: {item.category}
                    </div>
                    <div className="text-2xl mb-5">Price: {item.price}</div>
                    <button className="inline-block py-3 px-5 no-underline rounded-md font-bold uppercase bg-white text-gray-600">
                      Buy now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-14 w-max left-[60%] flex gap-5 z-100">
            {items.map((item, index) => (
              <div
                key={index}
                className={`w-40 h-60 flex-shrink-0 relative cursor-pointer ${
                  index === activeIndex ? "border-4 border-primary" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  className="w-full h-full object-cover rounded-[20px]"
                  src={item.img}
                  alt={item.name}
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="title">{item.name}</div>
                  <div className="des">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-[80%] right-[52%] w-80 max-w-[30%] flex gap-3 items-center z-100">
            <button
              className="text-white w-10 h-10 rounded-full bg-gray-600 font-bold text-xl transition-all hover:bg-primary hover:text-[#555]"
              onClick={handlePrev}
            >
              &#8249;
            </button>
            <button
              className="text-white w-10 h-10 rounded-full bg-gray-600 font-bold text-xl transition-all hover:bg-primary hover:text-[#555]"
              onClick={handleNext}
            >
              &#8250;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
