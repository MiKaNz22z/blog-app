// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-91b96.firebaseapp.com",
  projectId: "blog-app-91b96",
  storageBucket: "blog-app-91b96.appspot.com",
  messagingSenderId: "843114678191",
  appId: "1:843114678191:web:c0a0a062461532fbea515a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);