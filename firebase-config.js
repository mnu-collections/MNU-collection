// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQwYdtbUSM7WM25eNUzN4NxFXEvvRGN1k",
  authDomain: "mnu-collection-9282f.firebaseapp.com",
  databaseURL: "https://mnu-collection-9282f-default-rtdb.firebaseio.com",
  projectId: "mnu-collection-9282f",
  storageBucket: "mnu-collection-9282f.firebasestorage.app",
  messagingSenderId: "88757917123",
  appId: "1:88757917123:web:3b1f8f53654fee25089976",
  measurementId: "G-JW6LQER5TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);