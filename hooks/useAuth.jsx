import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase.config';

// Remove the interface and types

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a new user document in Firestore
      const userRef = doc(db, 'users', user.uid);

      // Check if the document already exists
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user document
        const userData = {
          email: user.email,
          uid: user.uid,
          createdAt: serverTimestamp(),
          isAdmin: false,
          displayName: email.split('@')[0],
          lastLogin: serverTimestamp(),
        };

        try {
          await setDoc(userRef, userData);
        } catch (firestoreError) {
          console.error('Error creating user document:', firestoreError);
          // If Firestore fails, we should probably delete the auth user
          await user.delete();
          throw new Error('Failed to create user profile. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};