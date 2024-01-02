// Import required components from Bootstrap and React-Bootstrap 
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import required components from Firebase Firestore
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Create DsiplayEntries component which displays existing entries which have been submitted in a modern card format.
export function DisplayEntries() {
    const [entries, setEntries] = useState([]);
    const db = getFirestore();
   
    useEffect(() => {
      const entryRef = collection(db, "unbasedtakes");
      getDocs(entryRef).then((snapshot) => {
        const entryArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEntries(entryArray);
      });
    }, []);
   
    return (
      <div className="cardContainer">
        {entries.map((entry) => (
          <Card key={entry.id} style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{entry.submitter}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{entry.date}</Card.Subtitle>
              <Card.Text>{entry.context}</Card.Text>
              {entry.fileUrl && <Card.Link href={entry.fileUrl}>View Evidence</Card.Link>}
            </Card.Body>
          </Card>
        ))}
      </div>
    );
   }


   export default DisplayEntries;