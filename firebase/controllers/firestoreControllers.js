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
import { v4 as uuidv4 } from 'uuid';

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
  const data = { ...userData, products: [...userData.products, product] };

  await updateDoc(userDocumentRef, { ...data });
};
export const addMilestone = async (uid, path, milestone) => {
  const milestoneId = uuidv4();
  const id = await getDocId(uid);
  const userDocumentRef = await doc(db, 'users', id);
  const documentSnapshot = await getDoc(userDocumentRef);
  const userData = await documentSnapshot.data();

  let trazabilityIndex;
  let stageIndex;
  let productIndex;
  let p = 0;

  while (p < userData.products.length) {
    for (let i = 0; i < userData.products[p].trazability.length; i++) {
      const trazability = userData.products[p].trazability[i];

      for (let j = 0; j < trazability.line.length; j++) {
        if (trazability.line[j].path === path) {
          trazabilityIndex = j;
          stageIndex = i;
          productIndex = p;
        }
      }
    }
    p++;
  }

  const entry =
    userData.products[productIndex].trazability[trazabilityIndex].line[
      stageIndex
    ];
  const milestones = [...entry.milestones, { ...milestone, milestoneId }];
  const newEntry = { ...entry, milestones: milestones };

  const newUserData = { ...userData };
  newUserData.products[productIndex].trazability[trazabilityIndex].line[
    stageIndex
  ] = newEntry;

  await updateDoc(userDocumentRef, { ...newUserData });
};

export const deleteUserDoc = async (uid) => {
  const id = await getDocId(uid);
  const userDoc = doc(db, 'users', id);
  await deleteDoc(userDoc);
};

export const getUserProducts = async (uid) => {
  const id = await getDocId(uid);
  const userDocumentRef = await doc(db, 'users', id);
  try {
    const userDocumentRef = doc(db, 'users', id);
    const userDocumentSnapshot = await getDoc(userDocumentRef);

    if (userDocumentSnapshot.exists()) {
      const userData = userDocumentSnapshot.data();
      const userProducts = userData.products || [];
      return userProducts;
    } else {
      console.log('User document does not exist.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user products:', error);
    return [];
  }
};
