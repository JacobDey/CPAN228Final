import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import _ from "lodash";
import { Container, Row, Col, Card, Button, Carousel, Badge } from "react-bootstrap";

function SSSCollection() {
  const [featuredCards, setFeaturedCards] = useState([]);
  const [randomCards, setRandomCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all cards
        const response = await fetch(`http://localhost:8080/card/cards`);
        const cards = await response.json();
        
        // Set featured cards (using highest power as example)
        const sortedByPower = [...cards].sort((a, b) => b.power - a.power);
        setFeaturedCards(sortedByPower.slice(0, 3));
        
        // Set random selection of cards
        setRandomCards(_.sampleSize(cards, 5));
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to get color-specific class for badges
  const getColorClass = (colour) => {
    const colorMap = {
      red: "danger",
      blue: "primary",
      green: "success",
      yellow: "warning",
      purple: "purple",
      orange: "orange",
      white: "light"
    };
    return colorMap[colour?.toLowerCase()] || "secondary";
  };

  return (
    <Container className="py-4">
      {/* Hero Section */}
      <Card className="bg-dark text-white mb-4" style={{ height: "300px",}}>
        <Card.ImgOverlay className="d-flex flex-column justify-content-center text-center">
          <Card.Title className="display-4 fw-bold">Card Collection</Card.Title>
          <Card.Text className="lead">
            Explore your collection of powerful cards and build strategic decks
          </Card.Text>
          <div className="mt-3">
            <Button as={Link} to="/cards" variant="primary" className="me-2">Browse All Cards</Button>
            <Button as={Link} to="/decks" variant="outline-light">View Decks</Button>
          </div>
        </Card.ImgOverlay>
      </Card>

      {/* Featured Cards Carousel */}
      <Card className="mb-4">
        <Card.Header className="bg-dark text-white">
          <h3>Featured Cards</h3>
        </Card.Header>
        <Card.Body>
          {featuredCards.length > 0 && (
            <Carousel indicators={false}>
              {featuredCards.map(card => (
                <Carousel.Item key={card.id}>
                  <Row className="align-items-center">
                    <Col md={4} className="text-center">
                      <img 
                        src={card.imageUrl || `/api/placeholder/300/400`} 
                        alt={card.name} 
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    </Col>
                    <Col md={8}>
                      <h3>{card.name}</h3>
                      <Badge bg={getColorClass(card.colour)} className="me-2">{card.colour}</Badge>
                      <Badge bg="secondary">Power: {card.power}</Badge>
                      <p className="mt-3">{card.description || "A powerful card ready for battle."}</p>
                      <Button as={Link} to={`/card/${card.id}`} variant="outline-primary" size="sm">
                        View Details
                      </Button>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Card.Body>
      </Card>

      {/* Random Selection */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Explore Cards</h3>
        </Card.Header>
        <Card.Body>
          <SSSCardContainer cards={randomCards} />
          <div className="text-center mt-3">
            <Button as={Link} to="/cards" variant="primary">
              See All Cards
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SSSCollection;