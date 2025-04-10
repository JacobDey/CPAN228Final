import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card as BootstrapCard } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SSSCard from "../components/SSSCard";
import axios from "axios";

const SERVER_URL = "http://localhost:8080";

function SSSBoosterPack() {
  const [cards, setCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState(null);
  const [packShake, setPackShake] = useState(false);
  const navigate = useNavigate();

  // Function to get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Configure axios with authentication header
  const authAxios = axios.create({
    baseURL: SERVER_URL,
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const openBoosterPack = async () => {
    if (!getToken()) {
      setError("Please login to open booster packs");
      navigate("/");
      return;
    }

    setPackShake(true);
    setTimeout(() => setPackShake(false), 1000);
    
    try {
      setIsOpening(true);
      setError(null);
      
      // Get 3 random cards from the server
      const response = await axios.get(`${SERVER_URL}/card/random/3`);
      setCards(response.data);
      
      // Start opening animation
      setTimeout(() => {
        setIsRevealed(true);
        
        // Add the cards to user's collection
        addCardsToCollection(response.data.map(card => card.id));
      }, 2000);
      
    } catch (err) {
      console.error("Error opening booster pack:", err);
      setError("Failed to open booster pack. Please try again.");
      setIsOpening(false);
    }
  };

  const addCardsToCollection = async (cardIds) => {
    try {
      await authAxios.put(`${SERVER_URL}/users/addCards`, cardIds);
      console.log("Cards added to collection successfully");
    } catch (err) {
      if (err.status === 400) {
        alert("Please Login");
        navigate("/login");
    }
      console.error("Error adding cards to collection:", err);
      setError("Cards obtained but failed to add to collection. Please check your connection.");
    }
  };

  const resetPack = () => {
    setIsOpening(false);
    setIsRevealed(false);
    setCards([]);
  };

  return (
    <Container className="booster-pack-container my-5">
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <h1 className="booster-title">Booster Pack</h1>
          <p>Open a booster pack to receive 3 random cards for your collection!</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </Col>
      </Row>

      {!isOpening ? (
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div 
              className={`booster-pack ${packShake ? 'shake' : ''}`} 
              onClick={openBoosterPack}
            >
              <BootstrapCard 
                className="booster-pack-card mx-auto"
                style={{
                  width: '280px',
                  height: '400px',
                  backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="pack-shine"></div>
                <div className="pack-content">
                  <h2 style={{ 
                    fontFamily: "'Bangers', cursive",
                    color: '#4cc9f0',
                    textShadow: '0 0 5px rgba(76, 201, 240, 0.5)'
                  }}>
                    Triple Siege
                  </h2>
                  <div className="pack-icon">🃏</div>
                  <p style={{ color: '#f8f9fa', marginTop: '20px' }}>
                    Click to Open
                  </p>
                </div>
              </BootstrapCard>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={openBoosterPack}
              className="mt-4 open-button"
            >
              Open Pack
            </Button>
          </Col>
        </Row>
      ) : (
        <div className="cards-container">
          <div className={`cards-reveal ${isRevealed ? 'revealed' : ''}`}>
            {cards.map((card, index) => (
              <div 
                key={card.id} 
                className="card-slot"
                style={{ 
                  animationDelay: `${index * 0.3}s`,
                  transform: isRevealed ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  opacity: isRevealed ? 1 : 0
                }}
              >
                <SSSCard data={card} />
              </div>
            ))}
          </div>

          {isRevealed && (
            <Row className="justify-content-center mt-5">
              <Col md={4} className="text-center">
                <Button 
                  variant="success" 
                  className="me-2" 
                  onClick={() => navigate('/collection')}
                >
                  Go to Collection
                </Button>
                <Button 
                  variant="primary" 
                  onClick={resetPack}
                >
                  Open Another Pack
                </Button>
              </Col>
            </Row>
          )}
        </div>
      )}
    </Container>
  );
}

export default SSSBoosterPack;