import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUr_bMMbX1U2sRYktG5sLMO_IjLuugW0U",
  authDomain: "what-was-said.firebaseapp.com",
  projectId: "what-was-said",
  storageBucket: "what-was-said.appspot.com",
  messagingSenderId: "691674038815",
  appId: "1:691674038815:web:41bf4ff5e02e331d048b2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
