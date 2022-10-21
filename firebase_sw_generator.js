const fs = require('fs');

const env = process.argv[2];

let fileContents;
if (env === 'production') {
  fileContents = `
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyDG5mnDMLiwKlP1c8aqJG-aSjRmxQ4j5LU',
  authDomain: 'buddynus-production.firebaseapp.com',
  projectId: 'buddynus-production',
  storageBucket: 'buddynus-production.appspot.com',
  messagingSenderId: '41559472129',
  appId: '1:41559472129:web:1912a28e1eea15493ee800',
  measurementId: 'G-KCCJ371DZ3',
};

firebase.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
  `;
} else {
  fileContents = `
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

// Initialize the Firebase app in the service worker by passing the generated config
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

firebase.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
  `;
}

try {
  fs.writeFileSync('./public/firebase-messaging-sw.js', fileContents, {
    flag: 'w+',
  });
  console.log(
    `firebase-messaging-sw.js file successfully generated in ${env} mode.`
  );
} catch (error) {
  console.err(error);
}
