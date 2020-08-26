import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDZvJhNP5FtZH6uDPWrUgPoWf0stMk3Fx8",
  authDomain: "app-chatter.firebaseapp.com",
  databaseURL: "https://app-chatter.firebaseio.com",
  projectId: "app-chatter",
  storageBucket: "app-chatter.appspot.com",
  messagingSenderId: "268194436551",
  appId: "1:268194436551:web:3216c7528ccf3951bb35e2",
  measurementId: "G-WG75HPWCMD",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
