import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col, Alert, Form, Modal } from "react-bootstrap";
import axios from "axios";

function SSSDecks() {
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState(null);
    const [newDeckName, setNewDeckName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const SERVER_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchDecks = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${SERVER_URL}/users/allDeck`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDecks(response.data);

                // Get currently selected deck
                const selectedResponse = await axios.get(`${SERVER_URL}/users/deck`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSelectedDeck(selectedResponse.data?.id);
            } catch (err) {
                if (err.status === 400) {
                    alert("Please Login");
                    navigate("/login");
                }
                setError(err.response?.data || "Failed to load decks");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDecks();
    }, []);

    const handleSelectDeck = async (deckId, cardCount) => {
        if(cardCount != 21) {
            setError("You can only select deck with 21 cards");
            return;
        }
        try {
            await axios.put(`${SERVER_URL}/users/selectDeck/${deckId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSelectedDeck(deckId);
        } catch (err) {
            setError(err.response?.data || "Failed to select deck");
        }
    };

    const handleCreateNewDeck = async () => {
        if (!newDeckName.trim()) {
            setError("Deck name cannot be empty");
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${SERVER_URL}/decks/newDeck?deckName=${newDeckName}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Refresh decks
            const response = await axios.get(`${SERVER_URL}/users/allDeck`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDecks(response.data);
            setShowCreateModal(false);
            setNewDeckName("");
        } catch (err) {
            setError(err.response?.data || "Failed to create deck");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDeck = async () => {
        if (!deckToDelete) return;

        try {
            setIsLoading(true);
            await axios.delete(`${SERVER_URL}/decks/deleteDeck/${deckToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Refresh decks
            const response = await axios.get(`${SERVER_URL}/users/allDeck`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDecks(response.data);

            // If the deleted deck was the selected one, clear selection
            if (selectedDeck === deckToDelete) {
                setSelectedDeck(null);
            }

            setShowDeleteModal(false);
            setDeckToDelete(null);
        } catch (err) {
            setError(err.response?.data || "Failed to delete deck");
        } finally {
            setIsLoading(false);
        }
    };

    const promptDeleteDeck = (deckId, e) => {
        e.stopPropagation();
        setDeckToDelete(deckId);
        setShowDeleteModal(true);
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">My Decks</h1>
                <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2"
                >
                    Create New Deck
                </Button>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : decks.length === 0 ? (
                <Card className="text-center py-5">
                    <Card.Body>
                        <Card.Title>No Decks Found</Card.Title>
                        <Card.Text>
                            You don't have any decks yet. Create your first deck!
                        </Card.Text>
                        <Button
                            variant="primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create First Deck
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <Row className="g-4">
                    {decks.map(deck => {
                        const cardCount = Object.values(deck.cardList || {}).reduce((sum, count) => sum + count, 0);
                        return (
                            <Col key={deck.id}>
                                <Card
                                    className={`deck-card shadow-sm h-100 ${selectedDeck === deck.id ? 'border-success border-3' : ''}`}
                                    onClick={() => navigate(`/decks/${deck.id}`)}
                                >
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="text-truncate">{deck.name}</Card.Title>
                                        <Card.Text className="text-muted mb-3">
                                            {Object.values(deck.cardList || {}).reduce((sum, count) => sum + count, 0)} cards
                                        </Card.Text>
                                        <div className="mt-auto d-flex flex-column gap-2">
                                            <Button
                                                variant={selectedDeck === deck.id ? "success" : "outline-primary"}
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectDeck(deck.id, cardCount);
                                                }}
                                            >
                                                {selectedDeck === deck.id ? "✓ Selected" : "Select Deck"}
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={(e) => promptDeleteDeck(deck.id, e)}
                                            >
                                                Delete Deck
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                )}

            {/* Create Deck Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Deck</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Deck Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newDeckName}
                            onChange={(e) => setNewDeckName(e.target.value)}
                            placeholder="Enter deck name"
                            autoFocus
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateNewDeck}
                        disabled={isLoading || !newDeckName.trim()}
                    >
                        {isLoading ? 'Creating...' : 'Create Deck'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Deck Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this deck? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteDeck}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Deck'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default SSSDecks;