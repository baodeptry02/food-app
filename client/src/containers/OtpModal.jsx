import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { sendOtpEmail, verifyOtp as verifyOtpApi } from "../api/authApi";
import { FaEnvelope } from "react-icons/fa";
import LoadingAnimation from "../animations/loading-animation";

const OtpModal = ({ isOpen, onClose, email, onOtpSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [
      ...otp.map((d, idx) => (idx === index ? element.value : d)),
    ];
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("Text").slice(0, 6);
    const newOtp = [...pastedData.split("")];
    setOtp(newOtp);

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      setIsVerifying(false);
      return;
    }

    try {
      const response = await verifyOtpApi({ email: email, otp: otpCode });
      console.log("OTP Verification Response:", response);

      if (response.status === 200) {
        onOtpSuccess();
        onClose();
      } else {
        toast.error(
          "Invalid or expired OTP. Please try again or request the new one."
        );
        setOtp(new Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("OTP Verification Error: ", error);
      toast.error("Failed to verify OTP. Please try again.");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget || e.target.className === "modal-close") {
      onClose();
    }
  };

  const handleSendOtpEmail = async () => {
    setIsLoading(true);
    try {
      const response = await sendOtpEmail(email);
      console.log("Send OTP Email Response:", response);
      if (response.status === 200) {
        toast.success("OTP sent successfully. Please check your email.");
        setResendTimer(30);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Send OTP Email Error: ", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart =
      localPart.slice(0, 2) + "*****" + localPart.slice(-1);
    return `${maskedLocalPart}@${domain}`;
  };

  return (
    isOpen && (
      <div
        className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50"
        onClick={closeModal}
      >
        {isVerifying && <LoadingAnimation />}
        <div
          className="bg-white p-8 rounded-lg text-center w-80 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <FaEnvelope className="text-4xl text-blue-500 mx-auto" />
            <h3 className="text-2xl text-gray-800 mt-2">Verify your email</h3>
            <p className="text-sm text-gray-500">
              Your code was sent to you via email: {maskEmail(email)}
            </p>
          </div>
          <div className="flex justify-center gap-2 my-5" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            onClick={() => handleVerifyOtp()}
            className="w-full py-2 mb-2 text-lg text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
          >
            Verify
          </button>
          <button
            onClick={handleSendOtpEmail}
            className={`w-full py-2 text-lg text-white rounded transition duration-300 ${
              resendTimer > 0 || isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
            disabled={resendTimer > 0 || isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span className="ml-2">Sending...</span>
              </div>
            ) : (
              `Resend Email ${resendTimer > 0 ? `(${resendTimer}s)` : ""}`
            )}
          </button>
        </div>
      </div>
    )
  );
};

export default OtpModal;
