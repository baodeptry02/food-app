import React, { useEffect, useState } from 'react';
import { LoginBg, Logo } from '../assests';
import { LoginInput } from '../components';
import { FaEnvelope, FaLock, FcGoogle } from '../assests/icons';
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from '../config/firebase.config';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../context/actions/userActions';
import { updateUserInFirestore } from '../utils/fireStores.utils';
import { getUserFromFirestore, createUser } from '../api/userApi';
import Cookies from 'js-cookie';
import { sendOtpEmail, sendVerifyEmail, verifyOtp } from '../api/authApi';
import OtpModal from './OtpModal';
import LoadingAnimation from '../animations/loading-animation';
import PasswordChecklistComponent from './PasswordCheckList';
import PasswordStrengthBar from './PasswordStrengthBar';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState.user);

  // const handleForgotPass = () => {
  //   navigate("/reset-password");
  // };

  useEffect(() => {
    if (user) {
      return navigate('/', { replace: true });
    }
  }, [user]);

  const initialValues = {
    email: '',
    password: '',
    confirm_password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
      .min(6, 'Must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: isSignUp
      ? Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required')
      : Yup.string(),
  });

  const signUpWithEmailPassword = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const { email, password, confirm_password } = values;

      const userCred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCred.user;

      const username = email.split('@')[0];

      const userToSave = {
        uid: user.uid,
        name: username || 'N/A',
        email: user.email || 'N/A',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified || false,
        role: 'user',
        lastSignIn: new Date().toLocaleDateString(),
      };

      await createUser(userToSave);

      await sendVerifyEmail(email);

      await firebaseAuth.signOut();

      toast.success(
        'Register successful. An email has been sent to your email!'
      );
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use. Please use a different email.');
      } else {
        toast.error('Something went wrong. Please try again!');
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const updateLastSignIn = async (uid) => {
    const lastSignInTime = new Date().toLocaleDateString('en-GB'); // Use "en-GB" locale for DD/MM/YYYY format
    await updateUserInFirestore(uid, { lastSignIn: lastSignInTime });
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const userCred = await signInWithPopup(firebaseAuth, provider);
      const user = userCred.user;
      console.log(user);
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;
      await user.reload();

      let userData;
      try {
        userData = await getUserFromFirestore(user.uid);
        console.log(userData);
        console.log();
      } catch (error) {
        if (error.message === 'No such user!') {
          const username = user.email.split('@')[0];

          await createUser({
            uid: user.uid,
            name: user.displayName || username || 'N/A',
            email: user.email || 'N/A',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified || false,
            createdAt: new Date(
              parseInt(user.metadata.createdAt)
            ).toLocaleDateString('en-GB'),
          });
          console.log('User data saved to Firestore');

          userData = await getUserFromFirestore(user.uid);
        } else {
          throw error;
        }
      }

      await updateLastSignIn(user.uid);

      Cookies.set('authToken', token, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });

      // Save user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Login successful!');
      navigate('/', { replace: true });
      dispatch(setUserDetails(userData));
      console.log('Login successful!');
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error('Something went wrong. Please double check and try again!');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const signIn = async (values) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      setEmail(email);
      setPassword(password);

      const userCred = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCred.user;

      if (!user.emailVerified) {
        const result = await sendVerifyEmail(email);
        if (result.status !== 200) {
          return;
        } else {
          toast.error(
            'Email is not verified. A verification email has been sent.'
          );
        }
        await firebaseAuth.signOut();
        return;
      }

      await sendOtpEmail(email);
      setIsOtpSent(true);
      toast.info('OTP sent to your email. Please check your inbox.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Something went wrong. Please check and try again!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCred.user;
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;

      await updateLastSignIn(user.uid);
      let userData = await getUserFromFirestore(user.uid);

      if (user.emailVerified && !userData.emailVerified) {
        userData = { ...userData, emailVerified: true };
        await updateUserInFirestore(user.uid, { emailVerified: true });
      }

      Cookies.set('authToken', token, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');
      navigate('/', { replace: true });
      dispatch(setUserDetails(userData));
    } catch (error) {
      console.error('Login Error: ', error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many login attempts. Please try again later.');
      } else {
        toast.error('Something went wrong. Please double check and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      {isLoading && <LoadingAnimation />}
      <img
        src={LoginBg}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt="Login Background"
      />
      <div className="flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-2 px-4 py-12 gap-4 xl:gap-6">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center justify-start gap-4 w-full "
        >
          <img src={Logo} className="w-8" alt="Logo" />
          <p className="text-headingColor font-semibold text-2xl">City</p>
        </div>
        <p className="text-3xl font-semibold text-headingColor">Welcome Back</p>
        <p className="text-xl text-textColor -mt-6">
          {isSignUp ? 'Sign Up' : 'Sign In'} with following
        </p>
        {!isSignUp ? (
          <p>
            Doesn't have an account:{' '}
            <motion.button
              {...buttonClick}
              className="text-red-400 underline cursor-pointer bg-transparent"
              onClick={() => {
                setIsSignUp(true);
                setShowForgetPassword(false);
              }}
            >
              Create one
            </motion.button>
          </p>
        ) : (
          <p>
            Already have an account:{' '}
            <motion.button
              {...buttonClick}
              className="text-red-400 underline cursor-pointer bg-transparent"
              onClick={() => {
                setIsSignUp(false);
                setShowForgetPassword(true);
              }}
            >
              Sign-in here
            </motion.button>
          </p>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            if (isSignUp) {
              signUpWithEmailPassword(values, { resetForm });
            } else {
              signIn(values, { resetForm });
            }
          }}
        >
          {({ values, errors, touched }) => (
            <Form className="w-full flex flex-col items-center justify-center gap-4 px-4 md:px-12 pt-4 xl:gap-6">
              <LoginInput
                name="email"
                placeHolder="Email Here"
                icon={<FaEnvelope className="text-xl text-textColor" />}
                type="email"
                errors={errors.email}
                touched={touched.email}
                tabIndex={1}
              />
              <LoginInput
                name="password"
                placeHolder="Password Here"
                icon={<FaLock className="text-xl text-textColor" />}
                type="password"
                errors={errors.password}
                touched={touched.password}
                tabIndex={2}
              />
              {isSignUp && (
                <LoginInput
                  name="confirm_password"
                  placeHolder="Confirm Password Here"
                  icon={<FaLock className="text-xl text-textColor" />}
                  type="password"
                  errors={errors.confirm_password}
                  touched={touched.confirm_password}
                  tabIndex={3}
                />
              )}

              <PasswordStrengthBar password={values.password} />
              <PasswordChecklistComponent password={values.password} />
              {!isSignUp && showForgetPassword && (
                <p>
                  You dont remember your password:{' '}
                  <motion.button
                    {...buttonClick}
                    className="text-red-400 underline cursor-pointer bg-transparent"
                    onClick={() => navigate('/reset-password')}
                    type="button"
                  >
                    Click here
                  </motion.button>
                </p>
              )}
              {isSignUp ? (
                <motion.button
                  {...buttonClick}
                  type="submit"
                  className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
                  tabIndex={4}
                >
                  Sign Up
                </motion.button>
              ) : (
                <motion.button
                  {...buttonClick}
                  type="submit"
                  className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
                  tabIndex={3}
                >
                  Sign In
                </motion.button>
              )}
            </Form>
          )}
        </Formik>
        <div className="flex items-center justify-between gap-16 ">
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <p className="text-white">or</p>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
        </div>
        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={loginWithGoogle}
          tabIndex={6}
        >
          <FcGoogle className="text-3xl " />
          <p className="capitalize text-base text-headingColor">
            Signin with Google
          </p>
        </motion.div>
      </div>
      {isOtpSent && (
        <OtpModal
          email={email}
          isOpen={isOtpSent}
          onClose={() => setIsOtpSent(false)}
          onOtpSuccess={handleVerifyOtp}
        />
      )}
    </div>
  );
};

export default Login;
