import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCsrfzXzTGQ6DgRX35TL7yuT92tvhsX3s",
  authDomain: "gkdanentang-785b6.firebaseapp.com",
  projectId: "gkdanentang-785b6",
  storageBucket: "gkdanentang-785b6.firebasestorage.app",
  messagingSenderId: "1006325619970",
  appId: "1:1006325619970:web:bbb4b63f1c951ec3eb761b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);        // Firestore
export const storage = getStorage(app);     // Storage để upload hình