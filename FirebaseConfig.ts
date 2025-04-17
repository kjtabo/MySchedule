import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDJhuScpymVjkAAdHpegXxaGSrz-DLEYYs",
  authDomain: "myschedule-fa706.firebaseapp.com",
  projectId: "myschedule-fa706",
  storageBucket: "myschedule-fa706.firebasestorage.app",
  messagingSenderId: "743342153599",
  appId: "1:743342153599:web:9bd62da65898547bbd844a"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});