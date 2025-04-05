import { useEffect, useState } from "react";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import SSSCardFilter from "../components/SSSCardFilter.jsx";
import { Spinner, Alert, Container } from "react-bootstrap";

function SSSCards() {
    const [cardData, setCardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});

    const fetchCards = async (filters = {}) => {
        try {
            setLoading(true);
            
            let url = "http://localhost:8080/card/cards";
            
            // Apply filters if any
            if (filters.name) {
                url = `http://localhost:8080/card/name/${filters.name}`;
            } else if (filters.colour) {
                url = `http://localhost:8080/card/colour/${filters.colour}`;
            } else if (filters.power) {
                url = `http://localhost:8080/card/power/${filters.power}`;
            } else if (filters.minPower && filters.maxPower) {
                url = `http://localhost:8080/card/power/${filters.minPower}/${filters.maxPower}`;
            } else if (filters.minPower) {
                url = `http://localhost:8080/card/power/min/${filters.minPower}`;
            } else if (filters.maxPower) {
                url = `http://localhost:8080/card/power/max/${filters.maxPower}`;
            }
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const cards = await response.json();
            setCardData(cards);
            setError(null);
        } catch (err) {
            console.error("Error fetching cards:", err);
            setError(err.message);
            setCardData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const applyFilters = (filters) => {
        setActiveFilters(filters);
        fetchCards(filters);
    };

    return (
        <Container>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Card Collection</h1>
                
                <SSSCardFilter applyFilters={applyFilters} />
                
                {Object.keys(activeFilters).length > 0 && (
                    <Alert variant="info" className="mb-3">
                        Showing filtered results. {cardData.length} card(s) found.
                    </Alert>
                )}
                
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
                
                {!loading && !error && cardData.length > 0 && (
                    <SSSCardContainer cards={cardData} />
                )}
                
                {!loading && !error && cardData.length === 0 && (
                    <Alert variant="warning">
                        No cards found for the selected filters.
                    </Alert>
                )}
            </div>
        </Container>
    );
}

export default SSSCards;