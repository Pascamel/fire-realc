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
    this.firestore = app.firestore();
  }

  // Auth

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // Users

  getUser = (uid) => this.firestore.collection('users').doc(uid).get();
  getUsers = () => this.firestore.collection('users').get();
  getCurrentUserUID = () => this.auth.currentUser.uid;
  setUser = (uid, data) => this.firestore.collection('users').doc(uid).set(data);

  // Finance

  getHeaders = () => this.firestore.collection('headers').doc(this.auth.currentUser.uid).get();
  getRevenues = () => this.firestore.collection('income').doc(this.auth.currentUser.uid).get();
  getSavings = () => this.firestore.collection('savings').doc(this.auth.currentUser.uid).get();

  setHeaders = (data) => this.firestore.collection('headers').doc(this.auth.currentUser.uid).set(data);
  setRevenues = (data) => this.firestore.collection('income').doc(this.auth.currentUser.uid).set(data);
  setSavings = (data) => this.firestore.collection('savings').doc(this.auth.currentUser.uid).set(data);
}

export default Firebase;