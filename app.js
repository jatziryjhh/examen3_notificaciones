//pasos para crear en firebase una aplicacion web
//1. ir a firebase.google.com
//2. crear un proyecto
//3. agregar una aplicacion web
//4. copiar la configuracion
// Firebase config (la del profe)
// Importamos los módulos de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken, onMessage, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// Configuración obtenida desde Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBPMtb2JbTvQKvJQAQnGw5FaYWpdvMGbeE",
  authDomain: "examen3-firebase.firebaseapp.com",
  projectId: "examen3-firebase",
  storageBucket: "examen3-firebase.firebasestorage.app",
  messagingSenderId: "920573259228",
  appId: "1:920573259228:web:11739fcc30d606858db319"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Utilidades para manipular el DOM
const $ = (sel) => document.querySelector(sel);
const log = (m) => ($("#log").textContent += (($("#log").textContent === "—" ? "" : "\n") + m));

// Mostramos el estado inicial del permiso
$("#perm").textContent = Notification.permission;

// Registramos el Service Worker que manejará las notificaciones en segundo plano
let swReg;
if ('serviceWorker' in navigator) {
    swReg = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
    console.log('SW registrado:', swReg.scope);
}

// Verificamos si el navegador soporta FCM
const supported = await isSupported();
let messaging = null;

if (supported) {
    messaging = getMessaging(app);
} else {
    log("Este navegador no soporta FCM en la Web.");
}

// Clave pública VAPID (de Cloud Messaging)
const VAPID_KEY = "BJ0ZwdiKfrbpBKPUppZBbpjRX_VQVSGCrnkjScgxLJ60Gl9MUIrpQKrOczgENUjOAQnRrJrhuFzlDZgvqU12tlY";

// Función para pedir permiso al usuario y obtener token
async function requestPermissionAndGetToken() {
    try {
        const permission = await Notification.requestPermission();
        $("#perm").textContent = permission;

        if (permission !== 'granted') {
            log("Permiso denegado por el usuario.");
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swReg,
        });

        if (token) {
            $("#token").textContent = token;
            log("Token obtenido. Usa este token en Firebase Console → Cloud Messaging.");
        } else {
            log("No se pudo obtener el token.");
        }
    } catch (err) {
        console.error(err);
        log("Error al obtener token: " + err.message);
    }
}

// Escuchamos mensajes cuando la pestaña está abierta
if (messaging) {
    onMessage(messaging, (payload) => {
        log("Mensaje en primer plano:\n" + JSON.stringify(payload, null, 2));
    });
}

// Vinculamos la función al botón de permiso
$("#btn-permission").addEventListener("click", requestPermissionAndGetToken);

//5.-ve a configuracion del proyecto en firebase
//8.-En Cloud Messaging
//9.-Web configuration
//10.-crea una Web Push certificate (VAPID key) y copia la clave pública.
//para probarla es 
