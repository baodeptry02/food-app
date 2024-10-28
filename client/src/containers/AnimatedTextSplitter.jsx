import React, { useEffect, useRef, forwardRef } from "react";
import clsx from "clsx";
import gsap from "gsap";

const AnimatedTextSplitter = forwardRef(
  (
    {
      text = "", // Đặt giá trị mặc định để tránh điều kiện không gọi hook
      className,
      wordDisplayStyle = "inline-block",
      style,
      animationProps,
    },
    ref
  ) => {
    const charsRefs = useRef([]); // Tạo ref để lưu từng ký tự

    useEffect(() => {
      // Làm sạch refs mỗi lần render lại
      charsRefs.current = [];
    }, [text]);

    useEffect(() => {
      if (text && charsRefs.current.length > 0) {
        gsap.from(charsRefs.current, {
          y: -100,
          opacity: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power2.inOut",
          ...animationProps, // Thêm các tùy chọn animation tuỳ chỉnh
        });
      }
    }, [text, animationProps]);

    if (!text) return null; // Đặt điều kiện render sau hook

    const words = text.split(" ");

    return (
      <span style={{ whiteSpace: "pre", ...style }} ref={ref}>
        {words.map((word, wordIndex) => {
          const splitText = word.split("");
          return (
            <span
              className={clsx("split-word", className)}
              style={{ display: wordDisplayStyle }}
              key={`${wordIndex}-${word}`}
            >
              {splitText.map((char, charIndex) => {
                return (
                  <span
                    key={charIndex}
                    ref={(el) => {
                      if (el) charsRefs.current.push(el); // Chỉ thêm ref khi element không null
                    }}
                    className={`split-char inline-block split-char--${wordIndex}-${charIndex}`}
                  >
                    {char}
                  </span>
                );
              })}
              {wordIndex < words.length - 1 ? (
                <span className="split-char">{` `}</span>
              ) : null}
            </span>
          );
        })}
      </span>
    );
  }
);

export default AnimatedTextSplitter;
