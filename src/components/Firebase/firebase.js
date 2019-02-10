import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.firestore = app.firestore();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = (uid) => this.firestore.collection('users').doc(uid).get();
  users = () => this.firestore.collection('users').get();

  // money

  loadHeaders = () => this.firestore.collection('headers').doc(this.auth.currentUser.uid).get();
  loadRevenues = () => this.firestore.collection('income').doc(this.auth.currentUser.uid).get();
  loadSavings = () => this.firestore.collection('savings').doc(this.auth.currentUser.uid).get();

  saveHeaders = (data) => this.firestore.collection('headers').doc(this.auth.currentUser.uid).set(data);
  saveRevenues = (data) => this.firestore.collection('income').doc(this.auth.currentUser.uid).set(data);
  saveSavings = (data) => this.firestore.collection('savings').doc(this.auth.currentUser.uid).set(data);
}

export default Firebase;