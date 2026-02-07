// Import Firebase core
import { initializeApp } from "firebase/app";

// Import services you will use
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4LSDFhRkJ72gpG7texJSTngh_abdAXIM",
  authDomain: "streak-app-9f457.firebaseapp.com",
  projectId: "streak-app-9f457",
  storageBucket: "streak-app-9f457.firebasestorage.app",
  messagingSenderId: "586523734244",
  appId: "1:586523734244:web:fcc02d5b9931ebd7c47cf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORT THESE 👇 (very important)
export const auth = getAuth(app);
export const db = getFirestore(app);
