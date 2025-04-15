import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container, Button } from "react-bootstrap";
import SSSCard from "../components/SSSCard.jsx";

function SSSCardDetails() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    useEffect(() => {
        const fetchCard = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${SERVER_URL}/card/id/${id}`);
                
                if (!response.ok) {
                    throw new Error(`Error fetching card: ${response.status}`);
                }
                
                const cardData = await response.json();
                setCard(cardData);
                setError(null);
            } catch (err) {
                console.error("Error fetching card:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCard();
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading card details...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                    <Button variant="primary" onClick={handleGoBack}>
                        Go Back
                    </Button>
                </div>
            </Container>
        );
    }

    if (!card) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="alert alert-warning" role="alert">
                        Card not found
                    </div>
                    <Button variant="primary" onClick={handleGoBack}>
                        Go Back
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="my-4">
                <Button variant="outline-primary" onClick={handleGoBack} className="mb-4">
                    &larr; Back
                </Button>
                
                <div className="d-flex justify-content-center">
                    <SSSCard data={card} />
                </div>
            </div>
        </Container>
    );
}

export default SSSCardDetails;