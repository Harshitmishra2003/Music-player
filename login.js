// login.js
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user info and redirect
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "index.html"; // Redirect to main player page
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
