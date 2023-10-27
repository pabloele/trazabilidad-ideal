import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore/lite';
import { db } from '../config';

export const usersCollectionRef = collection(db, 'users');

export const getUsers = async () => {
  const data = await getDocs(usersCollectionRef);
  const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return users;
};

export const createUser = async (payload) => {
  await addDoc(usersCollectionRef, { ...payload });
};

export const getDocId = async (uid) => {
  const users = await getUsers();
  const user = users.find((user) => user.uid === uid);
  const { id } = user;
  return id;
};

export const addUserProduct = async (uid, product) => {
  const id = await getDocId(uid);
  const userDocumentRef = await doc(db, 'users', id);
  const documentSnapshot = await getDoc(userDocumentRef);
  const userData = await documentSnapshot.data();
  const updatedProducts = [...userData.products, product];

  const data = { ...userData, products: [...updatedProducts] };
  console.log(data);
  await updateDoc(userDocumentRef, { ...data });
};

export const deleteUserDoc = async (uid) => {
  const id = await getDocId(uid);
  console.log(id);
  const userDoc = doc(db, 'users', id);
  await deleteDoc(userDoc);
};

// export const addUserProduct = async (uid, product) => {
//   await updateUser(uid, product);
// };
