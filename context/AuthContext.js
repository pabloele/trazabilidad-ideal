import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signUpWithGoogle,
  GoogleAuthProvider,
} from 'firebase/auth';
import { FirebaseAuth } from '../firebase/config';
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

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(FirebaseAuth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(FirebaseAuth, email, password);
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

  const signUpWithGoogle = async () => {
    const { error, user } = await signUpWithGoogle(FirebaseAuth);
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
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
