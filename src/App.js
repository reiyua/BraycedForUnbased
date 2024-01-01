// Import required components and modules from Firebase and Firebase Config
import { firebaseConfig } from "./config/Config.js"
import { getApp, initializeApp } from "firebase/app"
import { useState, useEffect } from "react"
import { getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";

// Import required compenets from Bootstrap and React-Boostrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import './App.css'



export default App