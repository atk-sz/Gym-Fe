import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPm3GxHHYes05GQuFYxLBWqAgAczFuIC0",
  authDomain: "project-m-13c88.firebaseapp.com",
  projectId: "project-m-13c88",
  storageBucket: "project-m-13c88.appspot.com",
  messagingSenderId: "318315367189",
  appId: "1:318315367189:web:2d4044e59fd3edff6c371c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const projectStorage = firebase.storage()
