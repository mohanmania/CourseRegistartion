import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { useState, useRef, useEffect } from 'react';
import { getFirestore } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBe6UoNHUFwemkV3faXMasVb8K4t0Z7-LE",
  authDomain: "instagramclone-f910b.firebaseapp.com",
  databaseURL: "https://instagramclone-f910b-default-rtdb.firebaseio.com",
  projectId: "instagramclone-f910b",
  storageBucket: "instagramclone-f910b.appspot.com", 
  messagingSenderId: "124093598542",
  appId: "1:124093598542:web:2b9ad9f6e0ee1a64866c1f",
  measurementId: "G-D1ND8V1DTZ"
};


export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const storage = getStorage(app);
