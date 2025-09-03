// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCm1n6L8BspPCAl3zgC-TAw4Nxtedk96AY",
  authDomain: "musicpalyer-2af9f.firebaseapp.com",
  projectId: "musicpalyer-2af9f",
  storageBucket: "musicpalyer-2af9f.firebasestorage.app",
  messagingSenderId: "1076356897224",
  appId: "1:1076356897224:web:638d285651cbbd0095c8fd",
  measurementId: "G-8JJHKRSYPB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
