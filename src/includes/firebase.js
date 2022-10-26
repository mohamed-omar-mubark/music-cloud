import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN3pqfCQHtEUJ7vewk4FZbzBNxnr7KvGs",
  authDomain: "music-cloud-7880a.firebaseapp.com",
  projectId: "music-cloud-7880a",
  storageBucket: "music-cloud-7880a.appspot.com",
  appId: "1:332706813488:web:d0c6b9f9d0f4483a63fff5",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection("users");

export { auth, db, usersCollection };
