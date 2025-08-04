// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRbYuzChfJXtntOWMxs2A8EbFQf_MNNC8",
  authDomain: "mod9-ecommerce.firebaseapp.com",
  projectId: "mod9-ecommerce",
  storageBucket: "mod9-ecommerce.firebasestorage.app",
  messagingSenderId: "1096818882140",
  appId: "1:1096818882140:web:117583ff114c8593e85899",
  measurementId: "G-K4M7N4J4XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }