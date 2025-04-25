import firebaseAdmin from 'firebase-admin';

// Mengambil variabel lingkungan dengan fallback jika diperlukan
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')!;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!;

// Inisialisasi Firebase
if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY,
        }),
    });
}

// Inisialisasi layanan pesan Firebase
const firebaseMessaging = firebaseAdmin.messaging();

export default firebaseMessaging;
