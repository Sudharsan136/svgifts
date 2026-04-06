import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCafmcAZxqOWDlexWYsydqXRmEMXvZmms",
  authDomain: "svgifts-d20fb.firebaseapp.com",
  projectId: "svgifts-d20fb",
  storageBucket: "svgifts-d20fb.firebasestorage.app",
  messagingSenderId: "770410812171",
  appId: "1:770410812171:web:f366fa3692ea7b3ab5880e",
  measurementId: "G-7BL7YECMND"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
