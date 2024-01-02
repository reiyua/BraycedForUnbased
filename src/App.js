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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Import required compenets from Bootstrap and React-Boostrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';

// Import DisplayEntries component which displays existing reviews
import DisplayEntries from "./components/DisplayEntries.js";

// Import CSS
import './App.css'

// Initialize Firebase

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// declare variables

export function MyForm(props) {
  const [submitter, setSubmitter] = useState('');
  const [date, setDate] = useState('');
  const [context, setContext] = useState('');
  const [fileupload, setFileupload] = useState('');
  const [unbasedTakes, setUnbasedTakes] = useState([]);
  const storage = getStorage();
  const storageRef = ref(storage, `media/${fileupload.name}`);

  // Fetch incidents from Firestore when the component mounts
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const unbasedRef = collection(db, "unbasedtakes");
    getDocs(unbasedRef).then((snapshot) => {
      const unbasedtakesArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUnbasedTakes(unbasedtakesArray);
    });
  }, []);

  const db = getFirestore(getApp());

  // Create a function to handle the form submission and add data to Firebase.
  // Once user presses submit, a popup will appear stating the data was sent.
  // When user acknowledges popup and closes it, the page will reload,
  // clearing the form and adding the new data to the database.

  const submitHandler = async (event) => {
    event.preventDefault()
    let unbasedData = { submitter, date, context };
    
    // Handle file uploading to Firebase Storage
    if (fileupload) {
      const uploadTask = uploadBytesResumable(storageRef, fileupload);


     // Wait for the upload to finish
     await uploadTask.then(async () => {
       // Get the download URL after the upload is complete
       const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

       // Add the file URL to the form submission in Firestore along with other variables under the collection "unbasedtakes" with variable named "fileURL"
       unbasedData.fileUrl = fileUrl;
     });
   }
 
    const col = collection(db, `unbasedtakes`)
    const ref = await addDoc(col, unbasedData)
    console.log(ref)
    alert("Form submitted successfully!");
    window.location.reload();
  }

  // Create form for user to input data
  return (
    <div style={{ backgroundColor: '#84BC9C', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label style={{ fontSize: '40px' }}>Ray's Unbased Takes</Form.Label>
            <p>Submit any unbased takes Ray has about various food's, drinks or other ungodly, unbased opinions</p>
            <Col sm={2}></Col>
            <Col sm={8}>
              <Form.Label style={{ fontSize: '30px' }}>Enter submitter name:</Form.Label>
              <Form.Control
                name="submitter"
                type="text"
                placeholder="Name"
                value={submitter}
                onChange={(e) => setSubmitter(e.target.value)}
              />
              <Form.Label style={{ fontSize: '30px' }}>What date did Ray admit this cursed, unbased opinion? (dd-mm-yyyy):</Form.Label>
              <Form.Control
                name="date"
                type="text"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Form.Label style={{ fontSize: '30px' }}>Enter context and item for this unbased take of Ray:</Form.Label>
              <Form.Control
                type="text"
                name="context"
                placeholder="Enter context here"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              
              <Form.Label style={{ fontSize: '30px' }}>Optionally upload evidence:</Form.Label>
              <p>The storage bucket I get is limited to 1GB in total with the free tier Google provides but can upgrade if it get's used alot by us.</p>
              <Form.Control
                type="file"
                name="fileupload"
                placeholder="Upload file here"
                onChange={(e) => {
                  e.stopPropagation();
                  setFileupload(e.target.files[0]);
                }}
              />

              <Button type="submit">Submit</Button>
            </Col>
          </Form.Group>
        </Form>
        </div>
        <div>
        <h2>Existing Unbased Takes</h2>
        <DisplayEntries />
        </div>
    </div>
  );
}
export default MyForm;