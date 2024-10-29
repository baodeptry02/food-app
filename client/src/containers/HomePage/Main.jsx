import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FoodVideo } from "../../assests/index";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTextSplitter from "../AnimatedTextSplitter";
import Section2 from "./Section2";

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
        <Section2 ref={section2Ref} />
      </main>
    </div>
  );
}
