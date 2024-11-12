import React, { useState } from "react";
import { statuses } from "../utils/styles.utils";
import Spinner from "./Spinner";
import { FaCloudUploadAlt } from "react-icons/fa";
import { storage } from "../config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { MdDelete } from "react-icons/md";
import { createProduct } from "../api/productApi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LoadingAnimation from "../animations/loading-animation";

const DBNewItem = () => {
  const [category, setCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);

  const uploadImage = (e, setFieldValue) => {
    setIsUploading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(2);
        setProgress(progress);
      },
      () => {
        toast.error("An error occurred while uploading the image");
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadUrl(downloadURL);
          setProgress(null);
          setIsUploading(false);
          toast.success("Image uploaded successfully!");
          setFieldValue("imageDownloadUrl", downloadURL);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    setIsUploading(true);
    const deleteRef = ref(storage, imageDownloadUrl);

    deleteObject(deleteRef)
      .then(() => {
        setImageDownloadUrl(null);
        setIsUploading(false);
        toast.success("Image deleted successfully!");
      })
      .catch(() => {
        toast.error("An error occurred while deleting the image");
        setIsUploading(false);
      });
  };

  const validationSchema = Yup.object().shape({
    itemName: Yup.string().required("Item name is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a positive number"),
    imageDownloadUrl: Yup.string().required("Image is required"),
  });

  const submitData = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      await createProduct(values);
      toast.success("Product added successfully!");
      resetForm();
      setCategory(null);
      setImageDownloadUrl(null);
    } catch (error) {
      toast.error("An error occurred while adding the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        itemName: "",
        category: "",
        price: "",
        imageDownloadUrl: "",
      }}
      validationSchema={validationSchema}
      onSubmit={submitData}
    >
      {({ setFieldValue, errors, touched }) => (
        <Form className="flex items-center justify-center flex-col pt-6 px-24 w-full">
          {isSubmitting && <LoadingAnimation />}
          <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
            <div className="w-full">
              <Field
                type="text"
                name="itemName"
                placeholder="Item name here"
                className="dark:bg-slate-200 w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-600 focus:shadow-lg transition-all duration-300 ease-in-out"
              />
              <ErrorMessage
                name="itemName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="w-full flex items-center justify-around gap-3 flex-wrap">
              {statuses &&
                statuses.map((data) => (
                  <p
                    key={data.id}
                    onClick={() => {
                      setFieldValue("category", data.category);
                      setCategory(data.category);
                    }}
                    className={`px-4 py-3 rounded-md text-xl text-textColor dark:text-slate-300 font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${
                      data.category === category
                        ? "bg-red-600 !text-white"
                        : "bg-transparent"
                    }`}
                  >
                    {data.title}
                  </p>
                ))}
            </div>
            {errors.category && touched.category && (
              <div className="text-red-500">{errors.category}</div>
            )}
            <div className="w-full">
              <Field
                type="number"
                name="price"
                placeholder="Item price here"
                className="dark:bg-slate-200 w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-600 focus:shadow-lg transition-all duration-300 ease-in-out"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isUploading ? (
                <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
                  <Spinner />
                  {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                        style={{ width: `${progress}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {!imageDownloadUrl ? (
                    <>
                      <label htmlFor="upload-image">
                        <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                          <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                            <p className="font-bold text-4xl">
                              <FaCloudUploadAlt className="-rotate-0" />
                            </p>
                            <p className="text-lg text-textColor">
                              Click to upload an image
                            </p>
                          </div>
                          <input
                            id="upload-image"
                            type="file"
                            name="upload-image"
                            accept="image/*"
                            onChange={(e) => {
                              uploadImage(e, setFieldValue);
                              setFieldValue(
                                "imageDownloadUrl",
                                e.target.files[0].name
                              );
                            }}
                            className="w-0 h-0"
                          />
                        </div>
                      </label>
                    </>
                  ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <motion.img
                        whileHover={{ scale: 1.15 }}
                        src={imageDownloadUrl}
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        {...buttonClick}
                        type="button"
                        className="p-3 absolute top-3 right-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageFromFirebase(imageDownloadUrl);
                          setFieldValue("imageDownloadUrl", "");
                        }}
                      >
                        <MdDelete className="-rotate-0 text-xl" />
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
            {errors.imageDownloadUrl && touched.imageDownloadUrl && (
              <div className="text-red-500">{errors.imageDownloadUrl}</div>
            )}
            <motion.button
              {...buttonClick}
              type="submit"
              className="w-1/6 py-4 rounded-md bg-red-500 text-white font-semibold text-xl shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out"
            >
              Save
            </motion.button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export const InputValueField = ({
  type,
  placeHolder,
  stateValue,
  stateFunc,
}) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      value={stateValue}
      onChange={(e) => stateFunc(e.target.value)}
      className="w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border border-gray-200 focus:border-red-600 focus:shadow-lg transition-all duration-300 ease-in-out"
    />
  );
};

export default DBNewItem;
