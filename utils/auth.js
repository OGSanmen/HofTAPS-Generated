import { showToast } from './notifications.js';
import { auth, db } from '../firebase/firebase-config.js';

function isValidHofstraID(input) {
  const sanitized = input.trim().toLowerCase();
  const digits = sanitized.startsWith("h") ? sanitized.slice(1) : sanitized;
  return /^\d{9}$/.test(digits) && digits.startsWith("7");
}

window.handleSignUp = async function () {
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const hofstraID = document.getElementById("hofstra-id").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email.endsWith("@pride.hofstra.edu")) {
    return showToast("error", "Only @pride.hofstra.edu emails are allowed.");
  }

  if (!isValidHofstraID(hofstraID)) {
    return showToast("error", "Invalid Hofstra ID. Must be 9 digits starting with 7.");
  }

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;

    await user.sendEmailVerification();
    showToast("success", "Account created. Please verify your email.");

    const cleanID = hofstraID.toLowerCase().startsWith("h") ? hofstraID.slice(1) : hofstraID;

    await db.collection("users").doc(user.uid).set({
      firstName,
      lastName,
      email,
      hofstraID: cleanID,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      role: "user"
    });

    await auth.signOut();
    showToast("warning", "Verification email sent. Please check your inbox.");
  } catch (err) {
    showToast("error", err.message);
  }
};

