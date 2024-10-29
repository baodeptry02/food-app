import React, { useEffect, useRef } from "react";
import { buttonClick } from "../../animations";
import { Delivery, RamSay } from "../../assests";
import { motion } from "framer-motion";
import gsap from "gsap";
import { convertRichTextToPlainText } from "../../config/convertRichTextToPlainText";
import AnimatedTextSplitter from "../AnimatedTextSplitter";

const Section2 = React.forwardRef((props, ref) => {
  const text = "The Fastest Delivery in Your City"; // Your text to animate

  useEffect(() => {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1.5,
        markers: true,
      },
    });
  }, [ref]);
  return (
    <section
      ref={ref}
      className="hero w-full flex justify-center flex-col items-start mt-40 h-screen bg-primary px-6 md:px-24 2xl:px-96 gap-12 pb-24 lg:pb-0"
    >
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
                className="w-full h-full object-contain"
                src={Delivery}
                alt=""
              />
            </div>
          </div>
          <p className="title text-[40px] text-headingColor md:text-[72px] font-sans font-extrabold tracking-wider">
            The Fastest Delivery in
            <span className="text-orange-600"> Your City</span>
          </p>
          <p className="text-textColor text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
            omnis iusto ad cupiditate exercitationem veniam, ipsa laboriosam.
            Aliquam enim, repellendus quia unde, inventore adipisci rem delectus
            repellat eum rerum nisi.
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
            className="absolute right-0 md:-right-12 w-auto h-auto md:w-auto md:h-650 bg-center bg-cover object-cover"
            src={RamSay}
            alt=""
          />
        </div>
      </motion.div>
    </section>
  );
});

export default Section2;
