import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FoodVideo } from "../../assests/index";
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

  useEffect(() => {
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section2Ref.current,
        start: "top 30%",
        end: "90% 90%",
        scrub: 1,
      },
    });
    titleTimeline.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { y: 0, opacity: 1, duration: 2, ease: "power4.inOut" }
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
        stagger: 0.5,
        ease: "back.out(3)",
        duration: 3,
      }
    );

    titleTimeline.fromTo(
      ramsay.current,
      { opacity: 0, scale: 3 },
      {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power4.inOut",
      }
    );
    return () => {
      titleTimeline.scrollTrigger.kill();
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
          className="hero w-full flex justify-center flex-col items-start mt-40 h-screen bg-primary px-6 md:px-24 2xl:px-96 gap-12 pb-24 lg:pb-0"
        >
          {/* <div className="end-lottie"></div> */}
          <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <p className="title text-lg font-semibold text-orange-500">
          <AnimatedTextSplitter text={text} />
        </p> */}
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="px-4 py-1 flex items-center justify-center gap-2 bg-orange-100 rounded-full ">
                <p className="text-lg font-semibold text-orange-500">
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
              <p
                ref={titleRef}
                className="text-[40px] text-headingColor lg:text-[64px] md:text-[72px] font-sans font-extrabold tracking-wider"
              >
                The Fastest Delivery in
                <span ref={titleHightLightRef} className="text-orange-600">
                  <AnimatedTextSplitter
                    ref={titleHightLightRef}
                    className="text"
                    text="Your city"
                  />
                </span>
              </p>
              <p className="text-textColor text-lg">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
                omnis iusto ad cupiditate exercitationem veniam, ipsa
                laboriosam. Aliquam enim, repellendus quia unde, inventore
                adipisci rem delectus repellat eum rerum nisi.
              </p>
              <motion.button
                {...buttonClick}
                className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font-semibold"
              >
                Order Now
              </motion.button>
            </div>
            <div
              ref={ramsay}
              className=" py-2 flex-1 flex items-center justify-end relative"
            >
              <img
                className="absolute right-0 md:-right-12 w-auto h-auto md:w-auto md:h-650 bg-center bg-cover object-cover"
                src={RamSay}
                alt=""
              />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
