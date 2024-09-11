// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDur2GpSblRA8FDul1Vn5q3XU5ePnmb9rg",
  authDomain: "realtor-clone-b366c.firebaseapp.com",
  projectId: "realtor-clone-b366c",
  storageBucket: "realtor-clone-b366c.appspot.com",
  messagingSenderId: "377712686061",
  appId: "1:377712686061:web:8b34f5258806f0cc4e6de4",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
