import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXeHgxSZvMr1aESZsYspR17hqJyDg5WDQ",
  authDomain: "weather-dashboard-b1bb8.firebaseapp.com",
  projectId: "weather-dashboard-b1bb8",
  storageBucket: "weather-dashboard-b1bb8.firebasestorage.app",
  messagingSenderId: "1084746085870",
  appId: "1:1084746085870:web:c45b81cf644e3585c9caff",
  measurementId: "G-KCRFFFT4B0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOutUser = () => signOut(auth);
