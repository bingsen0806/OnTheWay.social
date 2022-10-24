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
