import SSSNavbar from "../components/SSSNavbar.jsx";
import {useEffect, useState} from "react";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import { Spinner, Alert } from "react-bootstrap";

function SSSCards(){
    const [cardData, setCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/card/cards`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const cards = await response.json();
                setCardData(cards);
                setError(null);
            } catch (err) {
                console.error("Error fetching cards:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCards();
    }, []);

    return(
        <>
            <SSSNavbar />
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Card Collection</h1>
                
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}
                
                {error && (
                    <Alert variant="danger">
                        Failed to load cards: {error}
                    </Alert>
                )}
                
                {!loading && !error && (
                    <SSSCardContainer cards={cardData} />
                )}
            </div>
        </>
    )
}

export default SSSCards;