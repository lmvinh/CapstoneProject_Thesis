// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
//import { getFirestore } from "firebase/getDatabase";
import { getDatabase, ref, set, get, child } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfwW8N-EBH9xBXE7iMpcDaosAG3jfEmlA",
  authDomain: "thesis-2a5a3.firebaseapp.com",
  projectId: "thesis-2a5a3",
  storageBucket: "thesis-2a5a3.firebasestorage.app",
  messagingSenderId: "866579086892",
  appId: "1:866579086892:web:69f4863d2615fbfc805b89",
  measurementId: "G-8MXZVN6FZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const  dbRelay = getFirestore(app);
const databaseRelay = getDatabase(app);

export { databaseRelay, ref, set, get, child };