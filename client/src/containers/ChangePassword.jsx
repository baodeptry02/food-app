import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmPasswordReset, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { app } from '../config/firebase.config';
import LoginInput from '../components/LoginInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { buttonClick } from '../animations';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [oobCode, setOobCode] = useState(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('oobCode');
    setOobCode(code);
  }, []);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const firebaseAuth = getAuth(app);

  const handleResetPassword = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    try {
      await confirmPasswordReset(firebaseAuth, oobCode, values.password);
      toast.success('Password has been reset successfully!');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gray-100">
      <div className="p-8 rounded-lg shadow-md w-full max-w-md bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
        >
          {({ errors, touched }) => (
            <Form className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
              <div className="mb-4 w-full">
                <LoginInput
                  name="password"
                  placeHolder="Enter your new password ..."
                  type="password"
                  errors={errors.password}
                  touched={touched.password}
                  tabIndex={1}
                />
              </div>
              <div className="mb-4 w-full">
                <LoginInput
                  name="confirmPassword"
                  placeHolder="Confirm your new password ..."
                  type="password"
                  errors={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  tabIndex={2}
                />
              </div>
              <motion.button
                {...buttonClick}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                tabIndex={3}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
