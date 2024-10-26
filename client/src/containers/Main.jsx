import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChickenVideo } from "../assests/index";
import { useGSAP } from "@gsap/react";

export default function Main() {
  const videoRef = useRef();
  const container = useRef();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 1.75 });
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
    if (showText) {
      gsap.from(".text-element", {
        y: -100,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  }, [showText]);

  return (
    <div>
      <main className="flex items-center justify-start flex-col bg-primary">
        <section
          className="w-screen h-screen mt-12 flex flex-col items-center justify-center overflow-hidden"
          ref={container}
        >
          <video
            ref={videoRef}
            src={ChickenVideo}
            id="introVideo"
            className="video-element w-full h-calc-minus-120 object-cover overflow-hidden pointer-events-none opacity-0"
            autoPlay
            muted
            playsInline
            loop
            type="video/mp4"
          />
          {showText && (
            <h1
              className=" text-element absolute text-white text-6xl uppercase tracking-10 font-poppins pointer-events-none"
              style={{
                WebkitTextStroke: "2px black", // This adds a border around each letter
                WebkitTextFillColor: "white", // This sets the fill color of the text
              }}
            >
              Chickenee
            </h1>
          )}
        </section>
        <div class="fixed top-0 left-0 w-full h-screen flex">
          <div class="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div class="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div class="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div class="block flex-1 h-full bg-primary clip-path-custom"></div>
          <div class="block flex-1 h-full bg-primary clip-path-custom"></div>
        </div>
        {/* Second Section */}
        <section className="w-screen h-screen bg-primary">
          {/* Content for the second section */}
        </section>
      </main>
    </div>
  );
}
