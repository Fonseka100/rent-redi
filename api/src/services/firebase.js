const admin = require('firebase-admin');
const path = require('path');

let db = null;

const initializeFirebase = () => {
  try {
    if (admin.apps.length > 0) {
      db = admin.database();
      return;
    }

    const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://rent-redi-c5e64-default-rtdb.firebaseio.com"
    });
    
    db = admin.database();
    console.log('Firebase initialized');
  } catch (error) {
    console.error('Firebase initialization failed:', error.message);
  }
};

initializeFirebase();

module.exports = db; 