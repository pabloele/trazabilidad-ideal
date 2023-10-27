import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore/lite';
import { db } from '../config';

export const usersCollectionRef = collection(db, 'users');

export const getUsers = async () => {
  const data = await getDocs(usersCollectionRef);
  const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return users;
};

export const createUser = async ({ uid, data }) => {
  await addDoc(usersCollectionRef, { uid, data: data });
};

export const getDocId = async (uid) => {
  const users = await getUsers();
  const user = users.find((user) => user.uid === uid);
  const { id } = user;
  return id;
};

export const updateUser = async (uid, data) => {
  const id = await getDocId(uid);
  const userDoc = await doc(db, 'users', id);

  const response = await updateDoc(userDoc, { data });
  console.log(response);
};

export const deleteUserDoc = async (uid) => {
  const id = await getDocId(uid);
  console.log(id);
  const userDoc = doc(db, 'users', id);
  await deleteDoc(userDoc);
};
