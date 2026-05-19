import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANgBA4u72zH7avPO9hwL1txfal4Ng_A1E",
  authDomain: "abb-plc-c26aa.firebaseapp.com",
  projectId: "abb-plc-c26aa",
  storageBucket: "abb-plc-c26aa.firebasestorage.app",
  messagingSenderId: "610463689641",
  appId: "1:610463689641:web:1e3e3e575ed7c52214b2b8",
  measurementId: "G-2RTMB4CRJB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
