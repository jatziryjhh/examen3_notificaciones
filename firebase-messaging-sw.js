// Importamos las versiones compat de Firebase para SW
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuración igual que en app.js
firebase.initializeApp({
    apiKey: "AIzaSyBPMtb2JbTvQKvJQAQnGw5FaYWpdvMGbeE",
    authDomain: "examen3-firebase.firebaseapp.com",
    projectId: "examen3-firebase",
    storageBucket: "examen3-firebase.firebasestorage.app",
    messagingSenderId: "920573259228",
    appId: "1:920573259228:web:11739fcc30d606858db319"
});

const messaging = firebase.messaging();

// Evento cuando llega un mensaje en segundo plano
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Notificación";
    const options = {
        body: payload.notification?.body || "",
        icon: "./images/icons/192.png"
    };
    self.registration.showNotification(title, options);
});

// Manejar clics en la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});