import React, { useEffect, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { storage } from '../config/firebase.config';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { buttonClick } from '../animations';
import { createProduct, getProductById } from '../api/productApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoadingAnimation from '../animations/loading-animation';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const product = await getProductById(id);
        setProductData(product);
        setImageDownloadUrl(product.imageDownloadUrl); // Set the image URL
      } catch (error) {
        toast.error('Failed to fetch product details');
        console.error('Fetch Product Error:', error);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const uploadImage = (e, setFieldValue) => {
    if (imageDownloadUrl) {
      deleteImageFromFirebase(); // Delete existing image
    }

    setIsUploading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressValue = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(2);
        setProgress(progressValue);
      },
      (error) => {
        toast.error('Image upload failed');
        console.error('Upload Error:', error);
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadUrl(downloadURL);
          setFieldValue('imageDownloadUrl', downloadURL);
          setProgress(0);
          setIsUploading(false);
          toast.success('Image uploaded successfully!');
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    if (!imageDownloadUrl) return;

    setIsUploading(true);
    const deleteRef = ref(storage, imageDownloadUrl);

    deleteObject(deleteRef)
      .then(() => {
        setImageDownloadUrl(null);
        toast.success('Image deleted successfully!');
      })
      .catch((error) => {
        toast.error('Image deletion failed');
        console.error('Delete Error:', error);
      })
      .finally(() => setIsUploading(false));
  };

  const validationSchema = Yup.object().shape({
    itemName: Yup.string().required('Item name is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price must be positive'),
    imageDownloadUrl: Yup.string().required('Image is required'),
  });

  const submitData = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      await createProduct(values);
      toast.success('Product added successfully!');
      resetForm();
      setImageDownloadUrl(null);
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Submit Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        itemName: productData?.itemName || '',
        price: productData?.price || '',
        imageDownloadUrl: imageDownloadUrl || '',
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={submitData}
    >
      {({ setFieldValue }) => (
        <Form className="flex flex-col items-center justify-center w-full p-6">
          {isSubmitting && <LoadingAnimation />}
          <div className="border p-4 rounded-md w-full flex flex-col gap-4">
            <div>
              <Field
                type="text"
                name="itemName"
                placeholder="Item Name"
                className="w-full px-4 py-3 border rounded-md"
              />
              <ErrorMessage
                name="itemName"
                component="div"
                className="text-red-500"
              />
            </div>

            <div>
              <Field
                type="number"
                name="price"
                placeholder="Price"
                className="w-full px-4 py-3 border rounded-md"
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
                  {imageDownloadUrl ? (
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
                          deleteImageFromFirebase();
                          setFieldValue('imageDownloadUrl', '');
                        }}
                      >
                        <MdDelete className="-rotate-0 text-xl" />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="upload-image">
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
                          onChange={(e) => uploadImage(e, setFieldValue)}
                          className="w-0 h-0"
                        />
                      </label>
                    </>
                  )}
                </>
              )}
            </div>

            <motion.button
              {...buttonClick}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/6 mx-auto"
            >
              Save
            </motion.button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductDetails;
