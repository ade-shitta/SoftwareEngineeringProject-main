// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzzvsMtiKN68D62dlDqTXH_6qLRN8SCVE",
  authDomain: "timesheets-38b38.firebaseapp.com",
  projectId: "timesheets-38b38",
  storageBucket: "timesheets-38b38.appspot.com",
  messagingSenderId: "918974819002",
  appId: "1:918974819002:web:0eca66f2a12935b1217083"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app); 

export { auth, database };