import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Alert, Badge, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SSSCard from "../components/SSSCard.jsx";

// Card drag item component
const DraggableCard = ({ card, index, moveCard, removeCard, isDeckCard, availableCopies }) => {
    const ref = React.useRef(null);
    
    const [{ isDragging }, drag] = useDrag({
        type: isDeckCard ? 'deck-card' : 'available-card',
        item: () => ({ 
            id: card.tempId, 
            index, 
            card,
            sourceType: isDeckCard ? 'deck-cards' : 'available-cards'
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    
    const [, drop] = useDrop({
        accept: isDeckCard ? 'deck-card' : ['deck-card', 'available-card'],
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            
            // Only handle moving cards within the same list
            if (item.sourceType !== (isDeckCard ? 'deck-cards' : 'available-cards')) {
                return;
            }
            
            const dragIndex = item.index;
            const hoverIndex = index;
            
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            
            // Get rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Get mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            
            // Move the card
            moveCard(dragIndex, hoverIndex);
            
            // Update item index for the moving item
            item.index = hoverIndex;
        },
    });
    
    drag(drop(ref));
    
    const opacity = isDragging ? 0.4 : 1;
    
    return (
        <div ref={ref} style={{ opacity }} className="position-relative mb-2">
            <SSSCard data={card} compact={true} />
            {isDeckCard ? (
                <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute"
                    style={{
                        top: '8px',
                        right: '8px',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => removeCard(index)}
                >
                    &times;
                </Button>
            ) : (
                <Badge
                    bg="secondary"
                    className="position-absolute"
                    style={{ top: '8px', right: '8px' }}
                >
                    {availableCopies}
                </Badge>
            )}
        </div>
    );
};

// Drop target component for the card lists
const CardDropArea = ({ children, onDrop, isDeckArea }) => {
    const [{ isOver }, drop] = useDrop({
        accept: isDeckArea ? ['deck-card', 'available-card'] : 'deck-card',
        drop: (item, monitor) => {
            if (item.sourceType !== (isDeckArea ? 'deck-cards' : 'available-cards')) {
                onDrop(item);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });
    
    return (
        <div 
            ref={drop} 
            style={{
                minHeight: '500px',
                backgroundColor: isOver ? '#e6f7ff' : isDeckArea ? '#f8f9fa' : '#fff',
                borderRadius: '8px',
                padding: '16px',
                border: '2px dashed ' + (isOver ? '#4361ee' : '#dee2e6')
            }}
        >
            {children}
        </div>
    );
};

// Import React for refs
import React from 'react';

function SSSDeckDetail() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [userCards, setUserCards] = useState({});
    const [deckName, setDeckName] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deckCards, setDeckCards] = useState([]);
    const [availableCards, setAvailableCards] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    // Max cards allowed in deck
    const MAX_DECK_SIZE = 21;
    // Max copies of a single card allowed
    const MAX_CARD_COPIES = 3;

    useEffect(() => {
        fetchData();
    }, [deckId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch deck details
            const deckResponse = await axios.get(`${SERVER_URL}/decks/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDeck(deckResponse.data);
            setDeckName(deckResponse.data.name);

            // Fetch user's card collection
            const userCardsResponse = await axios.get(`${SERVER_URL}/users/card`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUserCards(userCardsResponse.data);

            // Get unique card IDs from user collection
            const userCardIds = Object.keys(userCardsResponse.data);

            // Fetch all user cards detail
            const cardsResponse = await axios.post(`${SERVER_URL}/card/cardByIds`, userCardIds, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCards(cardsResponse.data);

            // Process data once we have everything
            processCardData(deckResponse.data, cardsResponse.data, userCardsResponse.data);
        } catch (err) {
            if (err.status === 400) {
                alert("Please Login");
                navigate("/login");
            }
            console.log(err);
            setError(err.response?.data || "Failed to load deck data");
        } finally {
            setIsLoading(false);
        }
    };

    // Process card data to create the expanded deck cards array and available cards
    const processCardData = (deckData, allCards, userCollection) => {
        // Create expanded deck cards array (each card is an individual entry)
        const expandedDeckCards = [];

        Object.entries(deckData.cardList || {}).forEach(([cardId, count]) => {
            const cardData = allCards.find(c => c.id === cardId);
            if (cardData) {
                // Add each copy as a separate entry with a unique temp ID
                for (let i = 0; i < count; i++) {
                    expandedDeckCards.push({
                        ...cardData,
                        tempId: `${cardId}-${i}`, // Unique ID for drag/drop
                        originalId: cardId
                    });
                }
            }
        });

        setDeckCards(expandedDeckCards);

        // Create available cards array
        updateAvailableCards(expandedDeckCards, allCards, userCollection);
    };

    // Update available cards based on what's in the deck and user collection
    const updateAvailableCards = (currentDeckCards, allCards, userCollection) => {
        // Count cards already in deck
        const deckCardCounts = {};
        currentDeckCards.forEach(card => {
            deckCardCounts[card.originalId] = (deckCardCounts[card.originalId] || 0) + 1;
        });

        // Filter available cards based on user collection and what's already in deck
        const available = allCards
            .filter(card => {
                const inCollection = userCollection[card.id] > 0;
                const inDeckCount = deckCardCounts[card.id] || 0;
                const remainingCopies = Math.min(
                    userCollection[card.id] - inDeckCount,
                    MAX_CARD_COPIES - inDeckCount
                );
                return inCollection && remainingCopies > 0;
            })
            .map(card => {
                const inDeckCount = deckCardCounts[card.id] || 0;
                return {
                    ...card,
                    tempId: `available-${card.id}`,
                    originalId: card.id,
                    availableCopies: Math.min(
                        userCollection[card.id] - inDeckCount,
                        MAX_CARD_COPIES - inDeckCount
                    )
                };
            });

        setAvailableCards(available);
    };

    const handleSaveName = async () => {
        if (!deckName.trim()) {
            setError("Deck name cannot be empty");
            return;
        }

        try {
            setIsSaving(true);
            await axios.put(`${SERVER_URL}/decks/${deckId}`, { name: deckName }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Update the deck object
            setDeck(prev => ({ ...prev, name: deckName }));
            // Show success feedback
            setError("Deck name saved successfully");
            setTimeout(() => setError(null), 3000);
        } catch (err) {
            setError(err.response?.data || "Failed to update deck name");
        } finally {
            setIsSaving(false);
        }
    };

    const saveDeckToServer = async () => {
        if (deckCards.length != MAX_DECK_SIZE) {
            setError("Deck must contain exactly " + MAX_DECK_SIZE + " cards");
            return;
        }
        try {
            setIsSaving(true);

            //change deck state to Map<String,Integer> to make it simple for backend
            const cardListUpdate = {};
            deckCards.forEach(card => {
                cardListUpdate[card.id] = (cardListUpdate[card.id] || 0) + 1;
            });

            //send request to backend
            await axios.put(`${SERVER_URL}/decks/${deckId}/edit`, cardListUpdate, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setIsDirty(false);
            setError("Deck saved successfully");
            setTimeout(() => setError(null), 3000);
        } catch (err) {
            setError(err.response?.data || "Failed to save deck changes");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle card movement within the same list
    const moveCard = (listType, dragIndex, hoverIndex) => {
        if (listType === 'deck-cards') {
            const newDeckCards = [...deckCards];
            const dragCard = newDeckCards[dragIndex];
            newDeckCards.splice(dragIndex, 1);
            newDeckCards.splice(hoverIndex, 0, dragCard);
            setDeckCards(newDeckCards);
        } else {
            const newAvailableCards = [...availableCards];
            const dragCard = newAvailableCards[dragIndex];
            newAvailableCards.splice(dragIndex, 1);
            newAvailableCards.splice(hoverIndex, 0, dragCard);
            setAvailableCards(newAvailableCards);
        }
    };

    // Handle dropping card to deck
    const handleDropToDeck = (item, index = deckCards.length) => {
        // Check if maximum deck size reached
        if (deckCards.length >= MAX_DECK_SIZE) {
            setError(`Maximum deck size (${MAX_DECK_SIZE} cards) reached`);
            setTimeout(() => setError(null), 3000);
            return;
        }

        // Coming from available cards
        if (item.sourceType === 'available-cards') {
            const newCardId = Date.now().toString(); // Generate unique temp ID
            const newCard = {
                ...item.card,
                tempId: `${item.card.originalId}-${newCardId}`
            };

            const newDeckCards = [...deckCards];
            newDeckCards.splice(index, 0, newCard);
            setDeckCards(newDeckCards);

            // Update available cards
            updateAvailableCards(
                newDeckCards,
                cards,
                userCards
            );

            setIsDirty(true);
        }
    };

    // Handle dropping card from deck to available cards
    const handleDropToAvailable = (item) => {
        if (item.sourceType === 'deck-cards') {
            const newDeckCards = [...deckCards];
            const index = newDeckCards.findIndex(card => card.tempId === item.id);
            if (index !== -1) {
                newDeckCards.splice(index, 1);
                setDeckCards(newDeckCards);

                // Update available cards
                updateAvailableCards(
                    newDeckCards,
                    cards,
                    userCards
                );

                setIsDirty(true);
            }
        }
    };

    const handleRemoveCard = (index) => {
        const newDeckCards = [...deckCards];
        newDeckCards.splice(index, 1);
        setDeckCards(newDeckCards);

        // Update available cards
        updateAvailableCards(
            newDeckCards,
            cards,
            userCards
        );

        setIsDirty(true);
    };

    // Handle empty deck button click
    const handleEmptyDeck = () => {
        if (deckCards.length === 0) {
            setError("Deck is already empty");
            setTimeout(() => setError(null), 3000);
            return;
        }

        // Confirm before emptying deck
        if (window.confirm("Are you sure you want to remove all cards from your deck?")) {
            setDeckCards([]);
            
            // Update available cards
            updateAvailableCards([], cards, userCards);
            
            setIsDirty(true);
            setError("Deck has been emptied");
            setTimeout(() => setError(null), 3000);
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading deck details...</p>
                </div>
            </Container>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="deck-editor-container position-fixed vw-100 vh-100 d-flex flex-column bg-light">
                {/* Header */}
                <div className="deck-editor-header p-3 bg-white border-bottom shadow-sm d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <Button variant="light" onClick={() => navigate(-1)} className="me-3">
                            &larr; Back to Decks
                        </Button>
                        <h4 className="mb-0 me-3">Editing: {deckName}</h4>
                        <Form.Group className="d-flex align-items-center mb-0">
                            <Form.Control
                                type="text"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                                className="me-2"
                                style={{ width: '200px' }}
                            />
                            <Button
                                variant="outline-primary"
                                onClick={handleSaveName}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Name'}
                            </Button>
                        </Form.Group>
                    </div>
                    <div className="d-flex align-items-center">
                        <Badge bg={deckCards.length > MAX_DECK_SIZE ? "danger" : "info"} className="fs-6 me-3">
                            {deckCards.length} / {MAX_DECK_SIZE} cards
                        </Badge>
                        {/* Empty Deck Button */}
                        <Button
                            variant="warning"
                            onClick={handleEmptyDeck}
                            disabled={deckCards.length === 0 || isSaving}
                            className="me-3"
                        >
                            Empty Deck
                        </Button>
                        <Button
                            variant="success"
                            onClick={saveDeckToServer}
                            disabled={!isDirty || isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Deck'}
                        </Button>
                    </div>
                </div>

                {/* Notification Area */}
                {error && (
                    <Alert
                        variant={error.includes("successfully") || error.includes("emptied") ? "success" : "danger"}
                        onClose={() => setError(null)}
                        dismissible
                        className="m-2 mb-0"
                    >
                        {error}
                    </Alert>
                )}

                {/* Main Content */}
                <div className="deck-editor-content d-flex flex-grow-1 overflow-hidden">
                    {/* Left Panel - Deck Cards */}
                    <div className="deck-editor-card-list p-4 overflow-auto" style={{ width: '50%' }}>
                        <h3 className="mb-3">
                            Deck Cards
                            <small className="text-muted ms-2">
                                (Drag & drop to reorder)
                            </small>
                        </h3>
                        <CardDropArea onDrop={handleDropToDeck} isDeckArea={true}>
                            {deckCards.length === 0 ? (
                                <div className="text-center text-muted p-5">
                                    <i className="bi bi-card-list fs-1"></i>
                                    <p className="mt-3">Drag cards here to build your deck</p>
                                </div>
                            ) : (
                                deckCards.map((card, index) => (
                                    <DraggableCard
                                        key={card.tempId}
                                        card={card}
                                        index={index}
                                        moveCard={(dragIndex, hoverIndex) => moveCard('deck-cards', dragIndex, hoverIndex)}
                                        removeCard={handleRemoveCard}
                                        isDeckCard={true}
                                    />
                                ))
                            )}
                        </CardDropArea>
                    </div>

                    {/* Right Panel - Available Cards */}
                    <div className="deck-editor-available-cards p-4 overflow-auto bg-white border-start" style={{ width: '50%' }}>
                        <h3 className="mb-3">
                            Your Cards
                            <small className="text-muted ms-2">
                                (Drag to add to deck)
                            </small>
                        </h3>
                        <CardDropArea onDrop={handleDropToAvailable} isDeckArea={false}>
                            {availableCards.length === 0 ? (
                                <div className="text-center text-muted p-5">
                                    <i className="bi bi-collection fs-1"></i>
                                    <p className="mt-3">No more cards available to add</p>
                                </div>
                            ) : (
                                availableCards.map((card, index) => (
                                    <DraggableCard
                                        key={card.tempId}
                                        card={card}
                                        index={index}
                                        moveCard={(dragIndex, hoverIndex) => moveCard('available-cards', dragIndex, hoverIndex)}
                                        isDeckCard={false}
                                        availableCopies={card.availableCopies}
                                    />
                                ))
                            )}
                        </CardDropArea>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default SSSDeckDetail;