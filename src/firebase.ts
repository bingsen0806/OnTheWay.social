// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBO6Gi5G3sPLolBRLIwLx8kL1TstRkzfk4',
  authDomain: 'cs3216-final-group-9.firebaseapp.com',
  databaseURL:
    'https://cs3216-final-group-9-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'cs3216-final-group-9',
  storageBucket: 'cs3216-final-group-9.appspot.com',
  messagingSenderId: '212960746694',
  appId: '1:212960746694:web:70195a9f1a203e62b48bc7',
  measurementId: 'G-JRFQTGTPR5',
};

const firebaseConfigProduction = {
  apiKey: 'AIzaSyDG5mnDMLiwKlP1c8aqJG-aSjRmxQ4j5LU',
  authDomain: 'buddynus-production.firebaseapp.com',
  projectId: 'buddynus-production',
  storageBucket: 'buddynus-production.appspot.com',
  messagingSenderId: '41559472129',
  appId: '1:41559472129:web:1912a28e1eea15493ee800',
  measurementId: 'G-KCCJ371DZ3',
};

// Initialize Firebase
let app;
if (process.env.FIREBASE_ENV === 'production') {
  app = initializeApp(firebaseConfigProduction);
} else {
  app = initializeApp(firebaseConfig);
}
export const analytics = getAnalytics(app);

export const firestoreFunctions = getFunctions(app, 'asia-southeast2');
