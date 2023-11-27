import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  // signUpWithGoogle,
  GoogleAuthProvider,
  loginWithEmailPassword,
} from 'firebase/auth';
import { FirebaseAuth, FirebaseStorage } from '../firebase/config';
import { v4 } from 'uuid';
import {
  ref,
  uploadBytes,
  getStorage,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsusbscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsusbscribe();
  }, []);

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(FirebaseAuth, email, password);
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(
        FirebaseAuth,
        email,
        password
      );
      console.log('Login successful: ', response);
      return response;
    } catch (error) {
      console.error('Login error: ', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await signOut(FirebaseAuth);
  };

  const loginWithGoogle = async () => {
    console.log('hola');
    try {
      const googleAuthProvider = new GoogleAuthProvider();
      const respuesta = await signInWithPopup(FirebaseAuth, googleAuthProvider);
      console.log(respuesta);
      return respuesta;
    } catch (error) {
      console.log(error.message);
    }
  };

  // const loginWithGoogle = async () => {
  //   console.log("hola");
  //   try {
  //     const googleAuthProvider = new GoogleAuthProvider();
  //     await signInWithRedirect(FirebaseAuth, googleAuthProvider);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const signUpWithGoogle = async () => {
    const { error, user } = await signUpWithGoogle(FirebaseAuth);
  };

  const uploadFile = async (file) => {
    const storageRef = ref(FirebaseStorage, v4());
    return await uploadBytes(storageRef, file);
  };

  const getFile = async (firebaseFullpath) => {
    const imageRef = ref(FirebaseStorage, firebaseFullpath);

    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error obtaining image URL', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        signUpWithGoogle,
        loginWithGoogle,
        getFile,
        uploadFile,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
