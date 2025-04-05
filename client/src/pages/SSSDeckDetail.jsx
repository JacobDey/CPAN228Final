import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function SSSDeckDetail() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [userCards, setUserCards] = useState([]);
    const [deckName, setDeckName] = useState("");
    const [error, setError] = useState(null);
    const SERVER_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch deck details
                const deckResponse = await axios.get(`${SERVER_URL}/decks/${deckId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDeck(deckResponse.data);
                setDeckName(deckResponse.data.name);

                // Fetch all cards
                const cardsResponse = await axios.get(`${SERVER_URL}/card/cards`);
                setCards(cardsResponse.data);

                // Fetch user's card collection
                const userCardsResponse = await axios.get(`${SERVER_URL}/users/card`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserCards(userCardsResponse.data);
            } catch (err) {
                setError(err.response?.data || "Failed to load deck data");
            }
        };
        fetchData();
    }, [deckId]);

    const handleSaveName = async () => {
        try {
            await axios.put(`${SERVER_URL}/decks/${deckId}`, { name: deckName }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert("Saved Name")
        } catch (err) {
            setError(err.response?.data || "Failed to update deck name");
        }
    };

    const handleAddCard = async (cardId) => {
        try {
            await axios.put(`${SERVER_URL}/decks/addDeck/${deckId}/${cardId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh deck data
            const response = await axios.get(`${SERVER_URL}/decks/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDeck(response.data);
        } catch (err) {
            setError(err.response?.data || "Failed to add card");
        }
    };

    const handleRemoveCard = async (cardId) => {
        try {
            await axios.delete(`${SERVER_URL}/decks/removeDeck/${deckId}/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh deck data
            const response = await axios.get(`${SERVER_URL}/decks/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDeck(response.data);
        } catch (err) {
            setError(err.response?.data || "Failed to remove card");
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(Object.entries(deck.cardList));
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const newCardList = Object.fromEntries(items);

        setDeck({
            ...deck,
            cardList: newCardList
        });

    };

    if (!deck) return <div>Loading...</div>;

    return (
        <div className="deck-editor-container position-fixed vw-100 vh-100 d-flex flex-column bg-light">
            {/* Header */}
            <div className="deck-editor-header p-3 bg-white border-bottom shadow-sm d-flex align-items-center">
                <Button variant="light" onClick={() => navigate(-1)} className="me-3">
                    &larr; Back to Decks
                </Button>
                <h4 className="mb-0">Editing Deck: {deckName}</h4>
            </div>

            {/* Main Content */}
            <div className="deck-editor-content d-flex flex-grow-1 overflow-hidden">
                {/* Left Panel - Deck Cards */}
                <div className="deck-editor-card-list p-4 overflow-auto">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Form.Group className="d-flex align-items-center">
                            <Form.Control
                                type="text"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                                className="me-2"
                                style={{ width: '300px' }}
                            />
                            <Button variant="primary" onClick={handleSaveName}>
                                Save Name
                            </Button>
                        </Form.Group>
                        <Badge bg="info" className="fs-6">
                            {Object.values(deck.cardList || {}).reduce((sum, count) => sum + count, 0)} / 21 cards
                        </Badge>
                    </div>

                    <h3>Deck Cards</h3>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="deck-cards-container"
                                >
                                    {Object.entries(deck.cardList || {}).map(([cardId, count], index) => {
                                        const card = cards.find(c => c.id === cardId);
                                        if (!card) return null;

                                        return (
                                            <Draggable
                                                key={cardId}
                                                draggableId={cardId}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mb-3"
                                                    >
                                                        <Card>
                                                            <Card.Body className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <Card.Title>{card.name}</Card.Title>
                                                                    <Card.Text>
                                                                        Power: {card.power} | Color: {card.colour}
                                                                    </Card.Text>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <Badge bg="secondary" className="me-3">
                                                                        x{count}
                                                                    </Badge>
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveCard(cardId)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="deck-editor-available-cards p-4 overflow-auto bg-white border-start">
                    <h3>Available Cards</h3>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {cards.filter(card =>
                            userCards[card.id] > 0 &&
                            (!deck.cardList[card.id] || deck.cardList[card.id] < 3)
                        ).map(card => (
                            <Card key={card.id} className="mb-3">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title>{card.name}</Card.Title>
                                        <Card.Text>
                                            Power: {card.power} | You have: {userCards[card.id] || 0}
                                        </Card.Text>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleAddCard(card.id)}
                                        disabled={deck.cardList[card.id] >= 3}
                                    >
                                        Add ({deck.cardList[card.id] || 0}/3)
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SSSDeckDetail;