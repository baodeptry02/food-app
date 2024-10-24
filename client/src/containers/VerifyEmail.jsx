import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const location = useLocation();

  useEffect(() => {
    // Extract the query parameters from the URL
    const params = new URLSearchParams(location.search);
    const oobCode = params.get("oobCode");

    // Call the backend to verify the email
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `https://your-backend-domain/api/auth/verify-email?oobCode=${oobCode}`
        );
        setStatus(response.data.message);
      } catch (error) {
        setStatus("Failed to verify email. Please try again.");
      }
    };

    if (oobCode) {
      verifyEmail();
    } else {
      setStatus("Invalid verification link.");
    }
  }, [location.search]);

  return <div>{status}</div>;
};

export default VerifyEmail;
