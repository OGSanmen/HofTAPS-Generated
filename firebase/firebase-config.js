// DO NOT use `import firebase from ...` in compat mode
// Just reference global `firebase` object

// Firebase is already loaded globally from the CDN via <script>
const firebaseConfig = {
  apiKey: "AIzaSyDGUDmWvKcdlHF9zEbg94u2vqUs24xh2e8",
  authDomain: "hoftaps-262b6.firebaseapp.com",
  projectId: "hoftaps-262b6",
  storageBucket: "hoftaps-262b6.appspot.com",
  messagingSenderId: "981690147634",
  appId: "1:981690147634:web:hofstra-taps-platform"
};

// Initialize only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
