import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Alert, Badge, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SSSCard from "../components/SSSCard.jsx";

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
    const SERVER_URL = "http://localhost:8080";

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
        try {
            setIsSaving(true);

            // First, determine what cards need to be added/removed
            const currentDeckState = {};
            deckCards.forEach(card => {
                currentDeckState[card.originalId] = (currentDeckState[card.originalId] || 0) + 1;
            });

            const originalDeckState = deck.cardList || {};

            // Cards to remove first (to avoid conflicts)
            for (const [cardId, count] of Object.entries(originalDeckState)) {
                const currentCount = currentDeckState[cardId] || 0;
                const removeCount = count - currentCount;

                if (removeCount > 0) {
                    // Remove cards one by one
                    for (let i = 0; i < removeCount; i++) {
                        await axios.delete(`${SERVER_URL}/decks/removeDeck/${deckId}/${cardId}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    }
                }
            }

            // Cards to add
            for (const [cardId, count] of Object.entries(currentDeckState)) {
                const originalCount = originalDeckState[cardId] || 0;
                const addCount = count - originalCount;

                if (addCount > 0) {
                    // Add cards one by one
                    for (let i = 0; i < addCount; i++) {
                        await axios.put(`${SERVER_URL}/decks/addDeck/${deckId}/${cardId}`, {}, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    }
                }
            }

            // Update the deck object with new card list
            setDeck(prev => ({
                ...prev,
                cardList: { ...currentDeckState }
            }));

            setIsDirty(false);
            setError("Deck saved successfully");
            setTimeout(() => setError(null), 3000);
        } catch (err) {
            setError(err.response?.data || "Failed to save deck changes");
        } finally {
            setIsSaving(false);
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If dropped outside droppable area
        if (!destination) return;

        // Check if moving between areas or reordering
        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        // Get source and destination arrays
        let sourceArray = sourceId === 'deck-cards' ? [...deckCards] : [...availableCards];
        let destArray = destId === 'deck-cards' ? [...deckCards] : [...availableCards];

        // Moving within same array (reordering)
        if (sourceId === destId) {
            const [removed] = sourceArray.splice(source.index, 1);
            sourceArray.splice(destination.index, 0, removed);

            if (sourceId === 'deck-cards') {
                setDeckCards(sourceArray);
            } else {
                setAvailableCards(sourceArray);
            }
            return;
        }

        // Moving between arrays
        if (sourceId === 'available-cards' && destId === 'deck-cards') {
            // Adding card to deck

            // Check if maximum deck size reached
            if (deckCards.length >= MAX_DECK_SIZE) {
                setError(`Maximum deck size (${MAX_DECK_SIZE} cards) reached`);
                setTimeout(() => setError(null), 3000);
                return;
            }

            // Get card from available cards
            const cardToAdd = availableCards[source.index];
            const newCardId = Date.now().toString(); // Generate unique temp ID

            // Add card to deck with new temp ID
            const newCard = {
                ...cardToAdd,
                tempId: `${cardToAdd.originalId}-${newCardId}`
            };

            const newDeckCards = [...deckCards];
            newDeckCards.splice(destination.index, 0, newCard);
            setDeckCards(newDeckCards);

            // Update available cards
            updateAvailableCards(
                newDeckCards,
                cards,
                userCards
            );

            setIsDirty(true);
            return;
        }

        if (sourceId === 'deck-cards' && destId === 'available-cards') {
            // Removing card from deck
            const [removedCard] = deckCards.splice(source.index, 1);
            setDeckCards([...deckCards]);

            // Update available cards
            updateAvailableCards(
                [...deckCards],
                cards,
                userCards
            );

            setIsDirty(true);
            return;
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
                    variant={error.includes("successfully") ? "success" : "danger"}
                    onClose={() => setError(null)}
                    dismissible
                    className="m-2 mb-0"
                >
                    {error}
                </Alert>
            )}

            {/* Main Content */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="deck-editor-content d-flex flex-grow-1 overflow-hidden">
                    {/* Left Panel - Deck Cards */}
                    <div className="deck-editor-card-list p-4 overflow-auto" style={{ width: '50%' }}>
                        <h3 className="mb-3">
                            Deck Cards
                            <small className="text-muted ms-2">
                                (Drag & drop to reorder)
                            </small>
                        </h3>
                        <Droppable droppableId="deck-cards">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`deck-cards-container ${snapshot.isDraggingOver ? 'bg-light-blue' : ''}`}
                                    style={{
                                        minHeight: '500px',
                                        backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : '#f8f9fa',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        border: '2px dashed ' + (snapshot.isDraggingOver ? '#4361ee' : '#dee2e6')
                                    }}
                                >
                                    {deckCards.length === 0 ? (
                                        <div className="text-center text-muted p-5">
                                            <i className="bi bi-card-list fs-1"></i>
                                            <p className="mt-3">Drag cards here to build your deck</p>
                                        </div>
                                    ) : (
                                        deckCards.map((card, index) => (
                                            <Draggable
                                                key={card.tempId}
                                                draggableId={card.tempId}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className="position-relative mb-2">
                                                            <SSSCard data={card} compact={true} />
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
                                                                onClick={() => handleRemoveCard(index)}
                                                            >
                                                                &times;
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* Right Panel - Available Cards */}
                    <div className="deck-editor-available-cards p-4 overflow-auto bg-white border-start" style={{ width: '50%' }}>
                        <h3 className="mb-3">
                            Your Cards
                            <small className="text-muted ms-2">
                                (Drag to add to deck)
                            </small>
                        </h3>
                        <Droppable droppableId="available-cards">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`available-cards-container ${snapshot.isDraggingOver ? 'bg-light-blue' : ''}`}
                                    style={{
                                        minHeight: '500px',
                                        backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : '#fff',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        border: '2px dashed ' + (snapshot.isDraggingOver ? '#4361ee' : '#dee2e6')
                                    }}
                                >
                                    {availableCards.length === 0 ? (
                                        <div className="text-center text-muted p-5">
                                            <i className="bi bi-collection fs-1"></i>
                                            <p className="mt-3">No more cards available to add</p>
                                        </div>
                                    ) : (
                                        availableCards.map((card, index) => (
                                            <Draggable
                                                key={card.tempId}
                                                draggableId={card.tempId}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="position-relative mb-2"
                                                    >
                                                        <SSSCard data={card} compact={true} />
                                                        <Badge
                                                            bg="secondary"
                                                            className="position-absolute"
                                                            style={{ top: '8px', right: '8px' }}
                                                        >
                                                            {card.availableCopies}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

export default SSSDeckDetail;