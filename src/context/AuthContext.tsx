import React, {useState, useContext, useEffect, useRef} from 'react';
import {auth, db} from 'src/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {collection, addDoc, query, where, getDocs} from 'firebase/firestore';
import {IAuthProps} from './type';
import {LinearProgress} from '@mui/material';

const AuthContext = React.createContext(auth);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}: any) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useRef();
  const [progress, setProgress] = React.useState(0);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  const value: IAuthProps = {
    currentUser,
    login,
    signup,
    logout,
    userInfo,
    loading,
  };

  // console.log('loading:::', loading);
  // console.log('currentUser::: auth', currentUser);

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <LinearProgress color="inherit" />}
    </AuthContext.Provider>
  );
}
