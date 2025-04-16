import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card as BootstrapCard, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SSSCard from "../components/SSSCard";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
const PACK_COST = 300;

function SSSBoosterPack() {
  const [cards, setCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState(null);
  const [packShake, setPackShake] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canAfford, setCanAfford] = useState(false);
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

  // Fetch user credits on component mount
  useEffect(() => {
    fetchUserCredits();
  }, []);

  const fetchUserCredits = async () => {
    if (!getToken()) {
      setError("Please login to view your credits");
      return;
    }

    try {
      const response = await authAxios.get(`${SERVER_URL}/users/profile`);
      console.log(response.data);
      setUserCredits(response.data.credits);
      setCanAfford(response.data.credits >= PACK_COST);
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        setError("Failed to load user data. Please try again.");
      }
    }
  };

  const openBoosterPack = async () => {
    if (!getToken()) {
      setError("Please login to open booster packs");
      navigate("/login");
      return;
    }

    if (userCredits < PACK_COST) {
      setError(`Not enough credits. You need ${PACK_COST} credits to open a pack.`);
      return;
    }

    setPackShake(true);
    setTimeout(() => setPackShake(false), 1000);

    try {
      setIsOpening(true);
      setError(null);

      // Deduct credits first
      const response = await authAxios.put(`${SERVER_URL}/users/booster`);
      setUserCredits(userCredits-PACK_COST);

      // Get 3 random cards from the server
      setCards(response.data);

      // Start opening animation
      setTimeout(() => {
        setIsRevealed(true);
        setShowConfetti(true);

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
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        console.error("Error adding cards to collection:", err);
        setError("Cards obtained but failed to add to collection. Please check your connection.");
      }
    }
  };

  const resetPack = () => {
    setIsOpening(false);
    setIsRevealed(false);
    setShowConfetti(false);
    setCards([]);
    fetchUserCredits(); // Refresh credits after pack opening
  };

  return (
    <Container className="booster-pack-container my-5" style={{
      padding: '30px',
      borderRadius: '15px',
      background: 'linear-gradient(135deg, #2a2a72 0%, #471069 100%)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Animated background effect */}
      <div className="animated-bg-wrapper" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        borderRadius: '15px'
      }}>
        <div className="animated-bg" style={{
          backgroundImage: 'url("/images/magic-sparkles.png")',
          opacity: 0.1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          animation: 'float 120s linear infinite'
        }}></div>
      </div>

      {/* Credit Display */}
      <div className="credit-display" style={{
        position: 'absolute',
        top: '10px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '8px 15px',
        borderRadius: '20px',
        color: userCredits >= PACK_COST ? '#4CC9F0' : '#FF5A5A',
        border: `2px solid ${userCredits >= PACK_COST ? '#4361EE' : '#FF5A5A'}`,
        fontWeight: 'bold',
        fontSize: '1.1rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <span style={{ marginRight: '5px' }}>💎</span>
        <span>{userCredits}</span>
      </div>

      <Row className="justify-content-center text-center">
        <Col md={8}>
          <div style={{ 
            marginBottom: '40px', 
            position: 'relative',
            paddingTop: '20px'
          }}>
            <h1 className="booster-title" style={{
              textAlign: 'center',
              color: '#ffffff',
              marginBottom: '10px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '700',
              fontSize: '3.5rem',
              textShadow: '0 0 10px rgba(67, 97, 238, 0.7), 0 0 20px rgba(76, 201, 240, 0.5)'
            }}>BOOSTER PACK</h1>
            
            <div style={{ 
              position: 'relative', 
              display: 'inline-block',
              padding: '5px 15px',
              background: 'linear-gradient(45deg, #4361ee, #4cc9f0)',
              borderRadius: '30px',
              transform: 'rotate(-2deg)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
              <span style={{ 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: "'Bangers', cursive"
              }}>MYSTICAL TREASURES AWAIT</span>
            </div>
          </div>
          
          <div style={{ color: '#e0e0e0', fontSize: '1.1rem', marginBottom: '20px' }}>
            <p>Unleash the power of the arcane! Each pack contains 3 mysterious cards that could turn the tide of battle.</p>
            <p style={{ 
              fontWeight: 'bold', 
              color: '#4CC9F0',
              marginTop: '10px',
              padding: '8px 15px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              display: 'inline-block'
            }}>
              <span style={{ color: '#FF9F1C' }}>💰</span> Cost: 300 credits per pack
            </p>
          </div>
          
          {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: '400px' }}>{error}</Alert>}
        </Col>
      </Row>

      {!isOpening ? (
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div
              className={`booster-pack ${packShake ? 'shake' : ''}`}
              onClick={openBoosterPack}
              style={{ cursor: canAfford ? 'pointer' : 'not-allowed' }}
            >
              <div
                className="booster-hover"
                style={{ 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: 'scale(1)',
                  ':hover': {
                    transform: canAfford ? 'scale(1.05) rotate(1deg)' : 'scale(1)'
                  }
                }}
              >
                <BootstrapCard
                  className="booster-pack-card mx-auto"
                  style={{
                    width: '280px',
                    height: '420px',
                    backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    boxShadow: canAfford ? '0 10px 30px rgba(76, 201, 240, 0.3), 0 0 100px rgba(67, 97, 238, 0.2)' : '0 10px 20px rgba(0,0,0,0.4)',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '2px solid #4361ee',
                    opacity: canAfford ? 1 : 0.7
                  }}
                >
                  <div className="pack-shine" style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                    transform: 'skewX(-25deg)',
                    animation: 'shine 3s infinite'
                  }}></div>
                  
                  <div className="mystic-circle" style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(76, 201, 240, 0.1) 0%, rgba(67, 97, 238, 0.1) 70%, rgba(0, 0, 0, 0) 100%)',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  
                  <div className="pack-content" style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{ 
                      marginBottom: '10px',
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 20px',
                      background: 'url("/images/triple-siege-logo.png") center/contain no-repeat',
                      animation: 'float 3s ease-in-out infinite'
                    }}></div>
                    
                    <h2 style={{
                      fontFamily: "'Bangers', cursive",
                      fontSize: '2.5rem',
                      color: '#4cc9f0',
                      textShadow: '0 0 5px rgba(76, 201, 240, 0.5), 0 0 20px rgba(76, 201, 240, 0.3)'
                    }}>
                      Triple Siege
                    </h2>
                    
                    <div className="pack-icon" style={{
                      fontSize: '3rem',
                      margin: '15px 0',
                      animation: 'pulse 2s infinite'
                    }}>🃏</div>
                    
                    <p style={{ 
                      color: canAfford ? '#f8f9fa' : '#ff6b6b',
                      marginTop: '20px',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {canAfford ? 'Click to Open' : 'Need more credits!'}
                    </p>
                  </div>
                </BootstrapCard>
              </div>
            </div>
            
            <Button
              variant={canAfford ? "primary" : "secondary"}
              size="lg"
              onClick={canAfford ? openBoosterPack : () => setError("Not enough credits!")}
              className="mt-4 open-button"
              style={{
                background: canAfford ? 'linear-gradient(45deg, #4361ee, #4cc9f0)' : '#6c757d',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '30px',
                fontWeight: 'bold',
                boxShadow: canAfford ? '0 4px 15px rgba(67, 97, 238, 0.4)' : 'none',
                transform: canAfford ? 'translateY(0)' : 'none',
                transition: 'all 0.3s ease'
              }}
              disabled={!canAfford}
            >
              {canAfford ? 'Open Pack' : `Need ${PACK_COST - userCredits} more credits`}
            </Button>
            
            {!canAfford && (
              <p style={{ color: '#e0e0e0', marginTop: '15px', fontSize: '0.9rem' }}>
                Play more games to earn credits!
              </p>
            )}
          </Col>
        </Row>
      ) : (
        <div className="cards-container">
          {showConfetti && (
            <div className="confetti" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              pointerEvents: 'none'
            }}>
              {/* Simplified confetti effect - in production use a library like react-confetti */}
              {Array(50).fill().map((_, i) => (
                <div key={i} className="confetti-piece" style={{
                  position: 'absolute',
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: ['#4CC9F0', '#4361EE', '#F72585', '#7209B7', '#3A0CA3'][Math.floor(Math.random() * 5)],
                  top: '-10%',
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random(),
                  animation: `fall ${Math.random() * 3 + 2}s linear infinite, sway ${Math.random() * 3 + 2}s ease-in-out infinite`
                }}></div>
              ))}
            </div>
          )}
          
          <div className={`cards-reveal ${isRevealed ? 'revealed' : ''}`} style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            padding: '30px 0'
          }}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="card-slot"
                style={{
                  perspective: 1000,
                  borderRadius: '15px',
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? `rotateY(0) scale(1)` : 'rotateY(180deg) scale(0.8)',
                  transition: `opacity 0.8s ease, transform 0.8s ease ${index * 0.3}s`,
                  boxShadow: '0 0 15px 3px rgba(255, 255, 255, 0.4)',
                  ':hover': {
                    transform: 'scale(1.05)',
                    zIndex: 10
                  }
                }}
              >
                <SSSCard data={card} />
              </div>
            ))}
          </div>

          {isRevealed && (
            <Row className="justify-content-center mt-5">
              <Col md={4} className="text-center">
                <div
                  className="pack-buttons"
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: 'fadeInUp 0.5s forwards',
                    animationDelay: '1.5s'
                  }}
                >
                  <Button
                    variant="success"
                    className="mb-3"
                    onClick={() => navigate('/collection')}
                    style={{
                      background: 'linear-gradient(45deg, #06d6a0, #1b9aaa)',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '30px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(6, 214, 160, 0.4)'
                    }}
                  >
                    Go to Collection
                  </Button>
                  
                  <Button
                    variant="primary"
                    className="mb-3"
                    onClick={resetPack}
                    style={{
                      background: 'linear-gradient(45deg, #4361ee, #4cc9f0)',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '30px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(67, 97, 238, 0.4)'
                    }}
                    disabled={userCredits < PACK_COST}
                  >
                    {userCredits >= PACK_COST ? 'Open Another Pack' : 'Need More Credits'}
                  </Button>
                  
                  <p style={{ color: '#e0e0e0', marginTop: '15px' }}>
                    Credits remaining: <span style={{ fontWeight: 'bold', color: '#4CC9F0' }}>{userCredits}</span>
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-5deg); }
          50% { transform: translateX(10px) rotate(5deg); }
          75% { transform: translateX(-10px) rotate(-5deg); }
        }
        
        @keyframes fall {
          0% { top: -10%; transform: translateY(0); }
          100% { top: 100%; transform: translateY(0); }
        }
        
        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        .booster-hover:hover {
          transform: ${canAfford ? 'scale(1.05) rotate(1deg)' : 'scale(1)'};
        }
        
        .card-slot:hover {
          transform: scale(1.05);
          z-index: 10;
        }
      `}</style>
    </Container>
  );
}

export default SSSBoosterPack;