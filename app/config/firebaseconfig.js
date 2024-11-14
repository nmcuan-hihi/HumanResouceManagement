// app/config/firebaseconfig.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { useAppContext } from "../config/AppProvider"; // Import Context

export const getFirebaseConfig = (companyId) => {
  if (!companyId) {
    throw new Error("Company ID is required");
  }

  const databaseURL = `https://your-project-id.firebaseio.com/${companyId}`;

  return {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: databaseURL,  // Dùng URL với companyId
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  };
};

export const initializeFirebaseApp = (companyId) => {
  const firebaseConfig = getFirebaseConfig(companyId);

  if (getApps().length === 0) {
    initializeApp(firebaseConfig); // Khởi tạo Firebase nếu chưa có
  }

  const app = getApp(); // Lấy app Firebase đã khởi tạo
  const database = getDatabase(app);
  const storage = getStorage(app);
  const firestore = getFirestore(app);

  return { app, database, storage, firestore };
};
