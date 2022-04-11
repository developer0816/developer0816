// Firebase connection 
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount");
const { getDatabase } = require('firebase-admin/database');

// Initialize app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://no-let-sublet-staging-default-rtdb.firebaseio.com",
    storageBucket: "no-let-sublet-staging.appspot.com"
  });
  const fireStore = admin.firestore();


  // Get a database reference to our blog
const db = getDatabase();
const reference = db.ref('server');

var database = {};
// Cloud 
// const usersRef = fireStore.collection('users');
// Realtime
database.usersRef = reference.child('users');

module.exports = database;