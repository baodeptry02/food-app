import React, { useState } from "react";
import { toast } from "react-toastify";
import LoginInput from "../components/LoginInput";
import { FaEnvelope } from "react-icons/fa";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { buttonClick } from "../animations";
import { motion } from "framer-motion";
import { sendForgetPassword } from "../api";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const result = await sendForgetPassword(email);
      console.log(result);
      if (result.status !== 500) {
        toast.success("Password reset email sent!");
      } else {
        toast.error("Email isn't existed in database!");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-primary">
      <div className="p-8 rounded-lg shadow-md w-full max-w-md bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleForgotPassword(values.email)}
        >
          {({ errors, touched }) => (
            <Form className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
              <div className="mb-4 w-full">
                <LoginInput
                  name="email"
                  placeHolder="Enter your email ..."
                  icon={<FaEnvelope className="text-xl text-textColor" />}
                  type="email"
                  errors={errors.email}
                  touched={touched.email}
                  tabIndex={1}
                />
              </div>
              <motion.button
                {...buttonClick}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                tabIndex={2}
              >
                {isLoading ? "Sending..." : "Send Reset Email"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
