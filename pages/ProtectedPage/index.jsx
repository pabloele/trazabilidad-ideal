import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// import {
//   getFirestore,
//   query,
//   where,
//   collection,
//   onSnapshot,
// } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
const Protected = () => {
  const { user, logout } = useAuth();
  // console.log('/*-*/--*/-*/*//*-*-*-*-*-*-*-*', db ? db : null);
  // user ? console.log('USER    :', user.uid) : console.log('Not logged in');
  // const [nombre, setNombre] = useState('');

  // useEffect(() => {
  //   const collectionRef = collection(db, user.uid);
  //   const doc = collectionRef.doc();
  //   doc.set({
  //     nombre: 'Juan Pérez',
  //     edad: 25,
  //   });
  //   doc.save();
  //   // return () => {
  //   //   unsubscribe();
  //   // };
  // }, []);

  // const { user } = UserAuth();

  const userID = doc(db, 'users', `${user?.uid}`);
  const saveUser = async () => {
    if (user?.email) {
      await updateDoc(userID, {
        savedProtocol: [],
      });
    } else {
      alert('Por favor inicia sesión');
    }
  };
  return (
    <div>
      {user ? (
        <div>
          <h1>PROTEGIDO // {user.email}</h1>
        </div>
      ) : (
        <h1>NOT LOGGED IN</h1>
      )}
      <button onClick={saveUser}>save user</button>
    </div>
  );
};

export default Protected;
