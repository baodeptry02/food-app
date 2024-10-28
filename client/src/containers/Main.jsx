import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChickenVideo, Delivery, FoodVideo, HeroBg } from "../assests/index";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import AnimatedTextSplitter from "./AnimatedTextSplitter";

export default function Main() {
  const videoRef = useRef();
  const textRef = useRef();
  const container = useRef();
  const [showText, setShowText] = useState(false);
  const section2Ref = useRef();

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
    const tl = gsap.timeline({ delay: 1.5 });
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
    const pin = ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      endTrigger: section2Ref.current,
      end: "top top",
      pin: true,
      pinSpacing: false,
      markers: true,
    });

    const scrollAnimation = gsap.fromTo(
      section2Ref.current,
      { y: 0 },
      {
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top bottom",
          end: "top top",
          scrub: 4,
          onLeave: () => {
            gsap.to(videoRef.current, { opacity: 0, duration: 1 });
            pin.kill();
          },
          onEnterBack: () => {
            gsap.to(videoRef.current, { opacity: 1, duration: 1 });
            pin.enable();
          },
        },
        opacity: 1,
        y: 0,
      }
    );

    return () => {
      pin.kill();
      scrollAnimation.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div>
      <main className="flex flex-col bg-primary">
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
        <div className="fixed top-0 left-0 w-full h-screen flex">
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div className="block flex-1 h-full bg-primary clip-path-custom"></div>
        </div>
        <section
          ref={section2Ref}
          className="w-full flex justify-center flex-col items-start mt-40 h-screen bg-primary px-6 md:px-24 2xl:px-96 gap-12 pb-24"
        >
          <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="px-4 py-1 flex items-center justify-center gap-2 bg-orange-100 rounded-full ">
                <p className="text-lg font-semibold text-orange-500">
                  Free delivery
                </p>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary shadow-md">
                  <img
                    className="w-full h-full object-contain"
                    src={Delivery}
                    alt=""
                  />
                </div>
              </div>
              <p className="text-[40px] text-headingColor md:text-[72px] font-sans font-extrabold tracking-wider">
                The Fastest Delivery in
                <span className="text-orange-600">Your City</span>
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
            <div className="py-2 flex-1 flex items-center justify-end relative">
              <img
                className="absolute top-0 right-0 md:-right-12 w-full h-420 md:w-auto md:h-650"
                src={HeroBg}
                alt=""
              />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
