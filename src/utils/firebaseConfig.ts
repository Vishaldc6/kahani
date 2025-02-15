import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCA6FSdccJXmWVLt9AGE9sSO4QgsG8B1q0",
  authDomain: "kahani-3e243.firebaseapp.com",
  projectId: "kahani-3e243",
  storageBucket: "kahani-3e243.firebasestorage.app",
  messagingSenderId: "434501757718",
  appId: "1:434501757718:web:d2968679dcff3ff7debe37",
  measurementId: "G-JKK2RXYSBC",
  databaseURL: "https://kahani-3e243.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
