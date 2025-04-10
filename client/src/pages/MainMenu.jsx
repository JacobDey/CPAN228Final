import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Carousel, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../components/SSSAuth";
import SSSCard from "../components/SSSCard";

function MainMenu() {
  const { isLogIn, username } = useAuth();
  const [featuredCards, setFeaturedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCards = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/card/random/5");
        const data = await response.json();
        setFeaturedCards(data);
      } catch (error) {
        console.error("Error fetching featured cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCards();
  }, []);

  return (
    <Container fluid className="p-0 main-menu-container">
      {/* Hero Section */}
      <div 
        className="hero-section -mt-6 text-white text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "92vh",
          position: "relative",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          overflow: "hidden"
        }}
      >
        {/* Animated card background */}
        <div className="floating-cards">
          {["red", "blue", "yellow", "purple", "green"].map((color, index) => (
            <div 
              key={index}
              className="floating-card"
              style={{
                position: "absolute",
                width: "80px",
                height: "120px",
                backgroundColor: color === "white" ? "#f8f9fa" : color,
                opacity: 0.15,
                borderRadius: "10px",
                transform: `rotate(${Math.random() * 40 - 20}deg)`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                zIndex: 0
              }}
            />
          ))}
        </div>

        <div className="hero-content" style={{ zIndex: 1, padding: "0 20px" }}>
          <h1 
            className="game-title mb-4"
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "5rem",
              letterSpacing: "3px",
              color: "#4cc9f0",
              textShadow: "0 0 10px rgba(76, 201, 240, 0.7), 0 0 20px rgba(76, 201, 240, 0.5)"
            }}
          >
            Triple Siege
          </h1>
          
          <p className="lead mb-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Build powerful decks, engage in strategic battles, and become the ultimate card master in this thrilling card game!
          </p>

          {isLogIn && (
            <div className="mb-10 welcome-message">
              <Badge bg="info" className="p-3">
                <span className="h5 mb-0">Welcome back, {username}!</span>
              </Badge>
            </div>
          )}
          
          <div className="hero-buttons">
            {isLogIn ? (
              <>
                <Button 
                  as={Link} 
                  to="/battle" 
                  variant="danger" 
                  size="lg" 
                  className="me-3 px-4 py-2"
                  style={{ 
                    boxShadow: "0 0 15px rgba(220, 53, 69, 0.5)",
                    transition: "all 0.3s"
                  }}
                >
                  <span className="me-2">⚔️</span> Battle Now
                </Button>
                <Button 
                  as={Link} 
                  to="/collection" 
                  variant="primary" 
                  size="lg" 
                  className="me-3 px-4 py-2"
                  style={{ 
                    boxShadow: "0 0 15px rgba(13, 110, 253, 0.5)",
                    transition: "all 0.3s"
                  }}
                >
                  <span className="me-2">🃏</span> My Collection
                </Button>
                <Button 
                  as={Link} 
                  to="/booster" 
                  variant="warning" 
                  size="lg" 
                  className="px-4 py-2"
                  style={{ 
                    boxShadow: "0 0 15px rgba(255, 193, 7, 0.5)",
                    transition: "all 0.3s"
                  }}
                >
                  <span className="me-2">🎁</span> Open Packs
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="danger" 
                  size="lg" 
                  className="me-3 px-4 py-2"
                  style={{ 
                    boxShadow: "0 0 15px rgba(220, 53, 69, 0.5)",
                    transition: "all 0.3s"
                  }}
                >
                  Register Now
                </Button>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="primary" 
                  size="lg" 
                  className="me-3 px-4 py-2"
                  style={{ 
                    boxShadow: "0 0 15px rgba(13, 110, 253, 0.5)",
                    transition: "all 0.3s"
                  }}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/cards" 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4 py-2"
                  style={{ 
                    transition: "all 0.3s"
                  }}
                >
                  Preview Cards
                </Button>
              </>
            )}
          </div>
          

        </div>
        
        <div className="scroll-indicator" style={{ position: "absolute", bottom: "20px" }}>
          <div className="mouse-icon">
            <div className="wheel"></div>
          </div>
          <div className="arrow-down mt-2">
            <span>Scroll to explore</span>
          </div>
        </div>
      </div>
      
      {/* Game Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Game Features</h2>
          <Row className="g-4">
            {[
              { 
                title: "Strategic Battles", 
                icon: "⚔️", 
                color: "#dc3545",
                description: "Engage in thrilling card battles using strategy and powerful card combinations." 
              },
              { 
                title: "Collect Rare Cards", 
                icon: "🃏", 
                color: "#0d6efd",
                description: "Expand your collection with rare and powerful cards from booster packs." 
              },
              { 
                title: "Build Custom Decks", 
                icon: "🎮", 
                color: "#198754",
                description: "Create and customize decks to match your unique playstyle and strategies." 
              }
            ].map((feature, index) => (
              <Col md={4} key={index}>
                <Card 
                  className="h-100 text-center feature-card"
                  style={{ 
                    borderRadius: "12px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    overflow: "hidden",
                    border: "none",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                  }}
                >
                  <div 
                    className="icon-wrapper d-flex align-items-center justify-content-center mb-3 mt-4" 
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: feature.color,
                      margin: "0 auto",
                      fontSize: "2rem"
                    }}
                  >
                    {feature.icon}
                  </div>
                  <Card.Body>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Featured Cards Carousel */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #f6f6f6 0%, #eaeaea 100%)" }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">Featured Cards</h2>
              <p className="text-center text-muted">Check out some of the powerful cards you can collect</p>
            </Col>
          </Row>
          <Row>
            <Col className="position-relative">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="featured-cards">
                  <div className="d-flex justify-content-center flex-wrap">
                    {featuredCards.map((card) => (
                      <div key={card.id} className="mx-2 mb-3">
                        <SSSCard data={card} />
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Button as={Link} to="/cards" variant="outline-primary">View All Cards</Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Call to Action */}
      <section 
        className="py-5 text-center text-white"
        style={{ 
          background: "linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)"
        }}
      >
        <Container>
          <h2 className="mb-4">Ready to Begin Your Journey?</h2>
          <p className="lead mb-4">Join thousands of players in the ultimate card battle experience</p>
          {!isLogIn ? (
            <div>
              <Button 
                as={Link} 
                to="/register" 
                variant="danger" 
                size="lg" 
                className="me-3"
              >
                Create Account
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-light" 
                size="lg"
              >
                Login
              </Button>
            </div>
          ) : (
            <Button 
              as={Link} 
              to="/battle" 
              variant="danger" 
              size="lg"
            >
              Start Playing Now
            </Button>
          )}
        </Container>
      </section>
    </Container>
  );
}

export default MainMenu;