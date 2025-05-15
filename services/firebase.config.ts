import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7Y3El0AMqeqJIkdpJ8H-y5GcnXpLPA1Q",
  authDomain: "cshop-7ce66.firebaseapp.com",
  projectId: "cshop-7ce66",
  storageBucket: "cshop-7ce66.firebasestorage.app",
  messagingSenderId: "843236682017",
  appId: "1:843236682017:web:2e0119fefcee9c0b8bb660",
  measurementId: "G-GXDY1PB6TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics (only in web environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, analytics, db }; 