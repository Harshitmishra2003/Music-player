// ✅ auth.js — Cleaned and fixed version
import { auth } from "./firebase-config.js";
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");
  const emailDisplay = document.getElementById("user-email");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  // 🔒 Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        localStorage.removeItem("user");
        location.reload(); // or redirect to login.html if you prefer
      } catch (err) {
        console.error("Logout error:", err);
      }
    });
  }

  // 🔁 Detect login state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ✅ Logged in
      localStorage.setItem("user", JSON.stringify(user));

      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";

      if (emailDisplay) {
        emailDisplay.textContent = user.email;
        emailDisplay.style.display = "inline-block";
      }
    } else {
      // ❌ Logged out
      localStorage.removeItem("user");

      if (logoutBtn) logoutBtn.style.display = "none";
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (signupBtn) signupBtn.style.display = "inline-block";

      if (emailDisplay) {
        emailDisplay.textContent = "";
        emailDisplay.style.display = "none";
      }
    }
  });
});
