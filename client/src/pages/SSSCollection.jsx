import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import _ from "lodash";
import { Container, Row, Col, Card, Button, Carousel, Badge, Spinner, Placeholder } from "react-bootstrap";

function SSSCollection() {
  const [randomCards, setRandomCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${SERVER_URL}/card/random/3`);
        const cards = await response.json();
        setRandomCards(cards);
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <Button as={Link} to="/decks" variant="outline-light" className="me-2">View Decks</Button>
            <Button as={Link} to="/booster" variant="warning">
              <span className="me-2">🎁</span>Open Booster Pack
            </Button>
          </div>
        </Card.ImgOverlay>
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
                  }} />
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