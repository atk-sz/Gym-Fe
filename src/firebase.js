import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0r6pgwUG0j2ZvT73zpnXz2z7kDka5_ak",
  authDomain: "develop-d5c12.firebaseapp.com",
  projectId: "develop-d5c12",
  storageBucket: "develop-d5c12.appspot.com",
  messagingSenderId: "340041598165",
  appId: "1:340041598165:web:6a753bd56a1e3ea2ebce5c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const projectStorage = firebase.storage()
