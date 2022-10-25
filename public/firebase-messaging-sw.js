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
