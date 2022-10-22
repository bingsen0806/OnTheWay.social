// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import { sendNotificationRegistrationToken } from './api/notifications';
import { isPlatform } from '@ionic/react';

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
export let messaging: Messaging;
export let messagingVapidKey: string;
export let bucket: string;
// DO NOT change this this block in any way, it is critical to proper set up of firebase in dev and prod
if (process.env.REACT_APP_FIREBASE_ENV === 'production') {
  app = initializeApp(firebaseConfigProduction);
  // important to prevent black screen of death on ios, since they dont support Web push notifications
  if (!isPlatform('ios')) {
    messaging = getMessaging(app);
  }
  messagingVapidKey =
    'BL9A9yG8MSn5FsPOhj4O8KC7LRVEqGcV5K2DGRBvW1m0Cn8RVYxBqROKAiG_7fXT7ulSpS3l8zh5_0_m_4blt-4';
  bucket = 'gs://' + firebaseConfigProduction.storageBucket;
} else if (process.env.REACT_APP_FIREBASE_ENV === 'development') {
  app = initializeApp(firebaseConfig);
  if (!isPlatform('ios')) {
    messaging = getMessaging(app);
  }
  messagingVapidKey =
    'BJb3VUgYNO6eUCONrgGztXLAVb2J6zG1Cnq9wPrWlhOESB9uCDMiHLYgGVD0JM2qBPP8v5XlVGkkdXKwqBunNgE';
  bucket = 'gs://' + firebaseConfig.storageBucket;
} else {
  throw Error('Invalid FIREBASE_ENV');
}

export function generateAndSendNotificationRegistrationToken() {
  getToken(messaging, { vapidKey: messagingVapidKey })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
        void sendNotificationRegistrationToken(currentToken);
      } else {
        //TODO: error handling getting token
        console.log('problem getting token');
      }
    })
    .catch((error) => {
      console.log('error occured while retrieving token: ', error);
    });
}

export const analytics = getAnalytics(app);

export const firestoreFunctions = getFunctions(app, 'asia-southeast2');
