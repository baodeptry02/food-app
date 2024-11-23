import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const saveUserToFirestore = async (user) => {
  if (!user.uid) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
    });
    console.log('User saved to Firestore');
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

export const getUserFromFirestore = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error('No such user!');
  }
};

export const updateUserInFirestore = async (userId, updatedData) => {
  console.log(userId);
  console.log(updatedData);
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updatedData);
    console.log('User updated in Firestore');
  } catch (error) {
    console.error('Error updating user in Firestore:', error);
  }
};
