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

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// declare variables

export function MyForm(props) {
  const [submitter, setSubmitter] = useState('');
  const [date, setDate] = useState('');
  const [context, setContext] = useState('');

  // Fetch incidents from Firestore when the component mounts
  useEffect(() => {
    const incidentsRef = collection(db, "incidents");
    getDocs(incidentsRef).then((snapshot) => {
      const incidentsArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIncidents(incidentsArray);
    });
  }, []);

  // Ensure Firebase is initialized before using it
  if (!getApp().length) {
    initializeApp(firebaseConfig);

  }

  const db = getFirestore(getApp());


  // Create a function to handle the checkbox changes and update the state accordingly.
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };


  // Create a function to handle the form submission and add data to Firebase.
  // Once user presses submit, a popup will appearstating the data was sent.
  // When user acknowledges popup and closes it, the page will reload,
  // clearing the form and adding the new data to the database.


  const submitHandler = async (event) => {
    event.preventDefault()
    const unbasedData = { submitter, date, context} 
    const col = collection(db, `unbasedtakes`)
    const ref = await addDoc(col, unbasedData)
    console.log(ref)
    alert("Form submitted successfully!");
    window.location.reload();
  }

  // Create form for user to imput data
  return (
    <div style={{ backgroundColor: '#84BC9C' }}>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label style={{ fontSize: '40px' }}>Ray's Unbased Takes'</Form.Label>
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
            <Form.Label style={{ fontSize: '30px' }}>Enter the date the shennanigans occurred (dd-mm-yyyy):</Form.Label>
            <Form.Control
              name="date"
              type="text"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Form.Label style={{ fontSize: '30px' }}>Enter context for this unbased take of Ray:</Form.Label>
            <Form.Control
              type="text"
              name="context"
              placeholder="Enter context here"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            

            <Button type="submit">Submit</Button>
          </Col>
        </Form.Group>

        <Form.Group>
          <h2>Existing incidents in the database:</h2>
          {unbasedtakes.map((unbasee, index) => (
            <div key={unbasedtakes.id}>
              <h3><u>Incident ID:</u></h3>
              <p>{incident.id}</p>
              <h3>What date did this shennanigans occur?:</h3>
              <p>{incident.date}</p>
              <h3>Who submitted this:</h3>
              <p>{incident.submitter}</p>
              <h3>What caused Ray's moment?:</h3>
              <p>{incident.context}</p>
              <h3>What word's did Ray use this time?:</h3>
              <p>{incident.selectedOptions.join(', ')}</p>
              {index !== incidents.length - 1 && <hr style={{ fontWeight: 'bold' }} />}
            </div>
          ))}
        </Form.Group>
      </Form>
    </div>
    // Create a form group to display the existing entries in the database.        
  );
}
export default MyForm;