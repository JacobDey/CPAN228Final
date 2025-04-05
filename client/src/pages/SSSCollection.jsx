import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import _ from "lodash";
import { Container, Row, Col, Card, Button, Carousel, Badge, Spinner, Placeholder } from "react-bootstrap";

function SSSCollection() {
  const [featuredCards, setFeaturedCards] = useState([]);
  const [randomCards, setRandomCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageCache, setImageCache] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/card/cards`);
        const cards = await response.json();
        
        const sortedByPower = [...cards].sort((a, b) => b.power - a.power);
        setFeaturedCards(sortedByPower.slice(0, 3));
        setRandomCards(_.sampleSize(cards, 3));
        
        // Preload featured images
        sortedByPower.slice(0, 3).forEach(card => {
          const img = new Image();
          img.src = `http://localhost:8080/card/image/${card.id}`;
          img.onload = () => {
            setImageCache(prev => ({ ...prev, [card.id]: img.src }));
            setImagesLoaded(prev => ({ ...prev, [card.id]: true }));
          };
        });
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
      <Card className="bg-dark text-white mb-4" style={{ height: "300px" }}>
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
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Carousel indicators={false}>
              {featuredCards.map(card => (
                <Carousel.Item key={card.id}>
                  <Row className="align-items-center">
                    <Col md={4} className="text-center">
                      <div style={{
                        height: "200px",
                        width: "100%",
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px"
                      }}>
                        {imagesLoaded[card.id] ? (
                          <img 
                            src={imageCache[card.id] || `http://localhost:8080/card/image/${card.id}`}
                            alt={card.name}
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              objectFit: "contain",
                              transition: "opacity 0.3s ease",
                              opacity: imagesLoaded[card.id] ? 1 : 0
                            }}
                          />
                        ) : (
                          <Spinner animation="border" size="sm" />
                        )}
                      </div>
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
        <Card.Body style={{ minHeight: "300px" }}>
          {loading ? (
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {[...Array(5)].map((_, index) => (
                <Card key={`placeholder-${index}`} style={{ 
                  width: "180px", 
                  minWidth: "180px",
                  height: "300px",
                  overflow: "hidden"
                }}>
                  <Card.Img variant="top" as="div" style={{ 
                    height: "180px", 
                    backgroundColor: "#f8f9fa" 
                  }}/>
                  <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as={Card.Text} animation="glow">
                      <Placeholder xs={7} /> <br />
                      <Placeholder xs={4} /> <br />
                      <Placeholder xs={6} />
                    </Placeholder>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <SSSCardContainer cards={randomCards} />
              <div className="text-center mt-3">
                <Button as={Link} to="/cards" variant="primary">
                  See All Cards
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SSSCollection;