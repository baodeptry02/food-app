import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { TbMessageChatbot } from "react-icons/tb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import gsap from "gsap";
import { toast } from "react-toastify";

const BotMessage = ({ text }) => (
  <div className="bot-message p-2 my-1 max-w-[75%] bg-[#444444] dark:bg-[#ccc] self-end text-left rounded-lg text-white dark:text-black">
    {text}
  </div>
);

const UserMessage = ({ text }) => (
  <div className="user-message p-2 my-1 max-w-[75%] bg-[#2D2D2D] dark:bg-[#ccc] self-start text-left rounded-lg text-white dark:text-black">
    {text}
  </div>
);

const ChatWidget = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const chatIconRef = useRef(null);
  const textRef = useRef(null);
  const container = useRef(null);
  const isAnimating = useRef(false);
  const handleHover = () => {
    if (isAnimating.current) return;

    isAnimating.current = true;

    const tl = gsap.timeline();

    tl.to(container.current, {
      duration: 0.3,
      width: "168px",
    })
      .to(
        textRef.current,
        {
          duration: 0.8,
          opacity: 1,
          position: "relative",
          left: 0,
          x: 0,
          delay: 0.3,
        },
        "-=0.3"
      )
      .call(() => {
        isAnimating.current = false;
      });
  };

  const handleLeave = () => {
    if (isAnimating.current) return;

    isAnimating.current = true;

    const tl = gsap.timeline();

    tl.to(textRef.current, {
      duration: 0.1,
      opacity: 0,
      x: -50,
      position: "absolute",
      left: "100%",
    })
      .to(
        container.current,
        {
          duration: 0.1,
          width: "48px",
          height: "48px",
        },
        "-=0.1"
      )
      .call(() => {
        isAnimating.current = false;
      });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    gsap.fromTo(
      container.current,
      { opacity: 0, x: 100 },
      { opacity: 1, duration: 1, x: 0, delay: 4 }
    );
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const hitRequest = () => {
    if (message) {
      generateResponse(message);
    } else {
      toast.info("You must write something... !");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      hitRequest();
    }
  };

  const generateResponse = async (msg) => {
    if (!msg) return;

    const userMessage = { type: "userMsg", text: msg };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(msg);

      const botMessage = { type: "responseMsg", text: result.response.text() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: "responseMsg",
        text: "Error: Could not get response.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-widget z-[100000000]">
      {/* Floating Chat Icon with SVG and Hover Animation */}
      <div
        className="z-[100000001] chat-icon fixed bottom-5 right-5 cursor-pointer bg-[#181818] p-3 dark:bg-[#f0f0f0] dark:text-black rounded-full text-white flex items-center"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
        ref={container}
      >
        <TbMessageChatbot ref={chatIconRef} size={24} className="icon" />
        <div
          className="absolute left-full ml-2 text-white translate-x-3 dark:text-black"
          ref={textRef}
        >
          Can I help you?
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="z-[100000000] chat-window fixed bottom-20 right-5 w-80 bg-[#1a1a1a] text-white dark:bg-[#f0f0f0] dark:text-black rounded-lg shadow-lg p-4">
          <div className="header flex justify-between items-center mb-4">
            <h2 className="text-xl">AssistMe</h2>
            <button
              className="bg-[#181818] dark:bg-[#f0f0f0] p-2 rounded-full cursor-pointer border border-white dark:border-black"
              onClick={newChat}
            >
              New Chat
            </button>
          </div>

          <div className="messages h-64 overflow-y-auto mb-4 flex flex-col ">
            {messages.map((msg, index) =>
              msg.type === "userMsg" ? (
                <UserMessage key={index} text={msg.text} />
              ) : (
                <BotMessage key={index} text={msg.text} />
              )
            )}
            {loading && (
              <div className="bot-message w-[20%] p-2 my-1 bg-[#444444] dark:bg-[#ccc] self-end text-left rounded-lg flex items-center justify-center">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="inputBox flex items-center bg-[#1a1a1a] dark:bg-[#e4e4e4] rounded-full px-4 py-2 border-white border dark:border-none">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-white dark:text-[#0E0E0E]"
              placeholder="Write your message here..."
              onKeyPress={handleEnter}
            />
            {message && (
              <IoSend
                className="text-green-500 text-xl cursor-pointer ml-2"
                onClick={hitRequest}
              />
            )}
          </div>

          <p className="text-gray-400 text-xs mt-2 dark:text-black">
            AssistMe is developed by Baodeptry02. This AI uses the Gemini API to
            provide responses.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
