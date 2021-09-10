import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKUPsgdQfQgPEgD1PpPC08umu7tAnSjHw",
  authDomain: "gym-bde98.firebaseapp.com",
  projectId: "gym-bde98",
  storageBucket: "gym-bde98.appspot.com",
  messagingSenderId: "428696453181",
  appId: "1:428696453181:web:6b7e126ac19a086b0f6a54"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const projectStorage = firebase.storage()
