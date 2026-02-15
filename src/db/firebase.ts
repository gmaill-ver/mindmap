import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBNlRPf1aL_mh43TwUSq_nHGtnCMNNIdtc",
  authDomain: "mindmapx-f74c8.firebaseapp.com",
  projectId: "mindmapx-f74c8",
  storageBucket: "mindmapx-f74c8.firebasestorage.app",
  messagingSenderId: "127874198601",
  appId: "1:127874198601:web:3a1594de51d26b10356398",
  measurementId: "G-B7DNYN17WH",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Analytics (only in browser)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
