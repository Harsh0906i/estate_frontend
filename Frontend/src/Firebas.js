// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCbFH09nOwAMowJvkAoSvE1G-F40jOvqso',
  authDomain: "mern-project-eed8e.firebaseapp.com",
  projectId: "mern-project-eed8e",
  storageBucket: "mern-project-eed8e.appspot.com",
  messagingSenderId: "377914497214",
  appId: "1:377914497214:web:0cbf06f3959ea761f666ef"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);