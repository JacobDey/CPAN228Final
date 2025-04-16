import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Alert, Badge, Spinner, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import SSSCard from "../components/SSSCard.jsx";

// Card drag item component
const DraggableCard = ({ card, index, moveCard, removeCard, addToDeck, isDeckCard, availableCopies }) => {
    const ref = useRef(null);

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

    const handleCardClick = () => {
        if (isDeckCard) {
            removeCard(index);
        } else if (availableCopies > 0) {
            addToDeck(card);
        }
    };

    return (
        <div
            ref={ref}
            style={{ opacity }}
            className="position-relative mb-2 card-container"
            onClick={handleCardClick}
        >
            <div className="card-action-hint">
                {isDeckCard ? 'Click to remove' : 'Click to add'}
            </div>
            <SSSCard data={card} compact={true} />
            {isDeckCard ? (
                <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute remove-btn"
                    style={{
                        top: '8px',
                        right: '8px',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        removeCard(index);
                    }}
                >
                    &times;
                </Button>
            ) : (
                <>
                    <Badge
                        bg="secondary"
                        className="position-absolute"
                        style={{ top: '8px', right: '8px', zIndex: 5 }}
                    >
                        {availableCopies}
                    </Badge>
                    {availableCopies > 0 && (
                        <Button
                            variant="success"
                            size="sm"
                            className="position-absolute add-btn"
                            style={{
                                bottom: '8px',
                                right: '8px',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                addToDeck(card);
                            }}
                        >
                            +
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

// Drop target component for the card lists
const CardDropArea = ({ children, onDrop, isDeckArea, title, cardCount, maxCount }) => {
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
        <div className="card-area-container">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="m-0">{title}</h4>
                {isDeckArea && (
                    <Badge
                        bg={cardCount > maxCount ? "danger" : cardCount === maxCount ? "success" : "info"}
                        className="fs-6"
                    >
                        {cardCount} / {maxCount}
                    </Badge>
                )}
            </div>
            <div
                ref={drop}
                className={`card-drop-area ${isOver ? 'drop-highlight' : ''} ${isDeckArea ? 'deck-area' : 'available-area'}`}
            >
                {children}
            </div>
        </div>
    );
};

// Main component
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
    const [sortBy, setSortBy] = useState("color"); // New state for sorting
    const [searchTerm, setSearchTerm] = useState(""); // New state for searching
    const [isMobileView, setIsMobileView] = useState(false);
    const [activeTab, setActiveTab] = useState("deck"); // For mobile view tabs
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    // Max cards allowed in deck
    const MAX_DECK_SIZE = 21;
    // Max copies of a single card allowed
    const MAX_CARD_COPIES = 3;

    useEffect(() => {
        fetchData();

        // Check window size and update state
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
        };
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

    // Sort and filter available cards
    const sortedAndFilteredAvailableCards = () => {
        let filtered = [...availableCards];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(card =>
                card.name.toLowerCase().includes(term) ||
                (card.abilityText && card.abilityText.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "power":
                filtered.sort((a, b) => b.power - a.power);
                break;
            case "color":
                filtered.sort((a, b) => a.colour.localeCompare(b.colour));
                break;
        }

        return filtered;
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
            showTemporaryMessage("Deck name saved successfully", "success");
        } catch (err) {
            setError(err.response?.data || "Failed to update deck name");
        } finally {
            setIsSaving(false);
        }
    };

    const saveDeckToServer = async () => {
        if (deckCards.length != MAX_DECK_SIZE) {
            showTemporaryMessage(`Deck must contain exactly ${MAX_DECK_SIZE} cards`, "danger");
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
            showTemporaryMessage("Deck saved successfully", "success");
        } catch (err) {
            setError(err.response?.data || "Failed to save deck changes");
        } finally {
            setIsSaving(false);
        }
    };

    // Helper function for temporary messages
    const showTemporaryMessage = (message, type) => {
        setError(message);
        setTimeout(() => setError(null), 3000);
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

    // Handle adding card to deck (either by drop or click)
    const addCardToDeck = (card, index = deckCards.length) => {
        // Check if maximum deck size reached
        if (deckCards.length >= MAX_DECK_SIZE) {
            showTemporaryMessage(`Maximum deck size (${MAX_DECK_SIZE} cards) reached`, "danger");
            return;
        }

        const newCardId = Date.now().toString(); // Generate unique temp ID
        const newCard = {
            ...card,
            tempId: `${card.originalId}-${newCardId}`
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

        // On mobile, show a quick feedback
        if (isMobileView) {
            showTemporaryMessage(`Added ${card.name} to deck`, "success");
        }
    };

    // Handle dropping card to deck
    const handleDropToDeck = (item, index = deckCards.length) => {
        // Coming from available cards
        if (item.sourceType === 'available-cards') {
            addCardToDeck(item.card, index);
        }
    };

    // Handle adding card to deck via click
    const handleAddToDeck = (card) => {
        addCardToDeck(card);
    };

    // Handle dropping card from deck to available cards
    const handleDropToAvailable = (item) => {
        if (item.sourceType === 'deck-cards') {
            const newDeckCards = [...deckCards];
            const index = newDeckCards.findIndex(card => card.tempId === item.id);
            if (index !== -1) {
                removeCardFromDeck(index);
            }
        }
    };

    // Remove card from deck
    const removeCardFromDeck = (index) => {
        const newDeckCards = [...deckCards];
        const removedCard = newDeckCards[index];
        newDeckCards.splice(index, 1);
        setDeckCards(newDeckCards);

        // Update available cards
        updateAvailableCards(
            newDeckCards,
            cards,
            userCards
        );

        setIsDirty(true);

        // On mobile, show a quick feedback
        if (isMobileView) {
            showTemporaryMessage(`Removed ${removedCard.name} from deck`, "info");
        }
    };

    // Handle empty deck button click
    const handleEmptyDeck = () => {
        if (deckCards.length === 0) {
            showTemporaryMessage("Deck is already empty", "info");
            return;
        }

        // Confirm before emptying deck
        if (window.confirm("Are you sure you want to remove all cards from your deck?")) {
            setDeckCards([]);

            // Update available cards
            updateAvailableCards([], cards, userCards);

            setIsDirty(true);
            showTemporaryMessage("Deck has been emptied", "info");
        }
    };

    // Get the appropriate DnD backend
    const getDndBackend = () => {
        return isMobile ? TouchBackend : HTML5Backend;
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

    // For mobile view, we'll show tabs to switch between deck and available cards
    const mobileView = (
        <div className="deck-editor-mobile">
            <div className="deck-tabs d-flex mb-3">
                <Button
                    variant={activeTab === "deck" ? "primary" : "light"}
                    className="flex-grow-1"
                    onClick={() => setActiveTab("deck")}
                >
                    Deck ({deckCards.length}/{MAX_DECK_SIZE})
                </Button>
                <Button
                    variant={activeTab === "available" ? "primary" : "light"}
                    className="flex-grow-1"
                    onClick={() => setActiveTab("available")}
                >
                    Available Cards
                </Button>
            </div>

            {activeTab === "deck" ? (
                <CardDropArea
                    onDrop={handleDropToDeck}
                    isDeckArea={true}
                    title="Your Deck Cards"
                    cardCount={deckCards.length}
                    maxCount={MAX_DECK_SIZE}
                >
                    {deckCards.length === 0 ? (
                        <div className="text-center text-muted p-5">
                            <i className="bi bi-card-list fs-1"></i>
                            <p className="mt-3">No cards in your deck yet</p>
                            <Button
                                variant="outline-primary"
                                onClick={() => setActiveTab("available")}
                            >
                                Browse Available Cards
                            </Button>
                        </div>
                    ) : (
                        deckCards.map((card, index) => (
                            <DraggableCard
                                key={card.tempId}
                                card={card}
                                index={index}
                                moveCard={(dragIndex, hoverIndex) => moveCard('deck-cards', dragIndex, hoverIndex)}
                                removeCard={removeCardFromDeck}
                                addToDeck={handleAddToDeck}
                                isDeckCard={true}
                            />
                        ))
                    )}
                </CardDropArea>
            ) : (
                <div className="available-cards-section">
                    <div className="filter-controls mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search cards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                        />
                        <div className="d-flex">
                            <Form.Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="me-2"
                            >
                                <option value="color">Sort by Color</option>
                                <option value="name">Sort by Name</option>
                                <option value="power">Sort by Power</option>
                            </Form.Select>
                        </div>
                    </div>

                    <CardDropArea
                        onDrop={handleDropToAvailable}
                        isDeckArea={false}
                        title="Available Cards"
                    >
                        {sortedAndFilteredAvailableCards().length === 0 ? (
                            <div className="text-center text-muted p-5">
                                <i className="bi bi-collection fs-1"></i>
                                <p className="mt-3">No more cards available to add</p>
                            </div>
                        ) : (
                            sortedAndFilteredAvailableCards().map((card, index) => (
                                <DraggableCard
                                    key={card.tempId}
                                    card={card}
                                    index={index}
                                    moveCard={(dragIndex, hoverIndex) => moveCard('available-cards', dragIndex, hoverIndex)}
                                    addToDeck={handleAddToDeck}
                                    isDeckCard={false}
                                    availableCopies={card.availableCopies}
                                />
                            ))
                        )}
                    </CardDropArea>
                </div>
            )}
        </div>
    );

    // For desktop view, we'll show both panels side by side
    const desktopView = (
        <div className="deck-editor-content d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
            {/* Left Panel - Deck Cards */}
            <div className="deck-editor-card-list p-4 overflow-auto flex-grow-1 flex-shrink-1 flex-basis-0">
                <CardDropArea
                    onDrop={handleDropToDeck}
                    isDeckArea={true}
                    title="Deck Cards (Drag & drop to reorder)"
                    cardCount={deckCards.length}
                    maxCount={MAX_DECK_SIZE}
                >
                    {deckCards.length === 0 ? (
                        <div className="text-center text-muted p-5">
                            <i className="bi bi-card-list fs-1"></i>
                            <p className="mt-3">Drag or click cards to build your deck</p>
                        </div>
                    ) : (
                        deckCards.map((card, index) => (
                            <DraggableCard
                                key={card.tempId}
                                card={card}
                                index={index}
                                moveCard={(dragIndex, hoverIndex) => moveCard('deck-cards', dragIndex, hoverIndex)}
                                removeCard={removeCardFromDeck}
                                addToDeck={handleAddToDeck}
                                isDeckCard={true}
                            />
                        ))
                    )}
                </CardDropArea>
            </div>

            {/* Right Panel - Available Cards */}
            <div className="deck-editor-available-cards p-4 overflow-auto bg-white border-start flex-grow-1 flex-shrink-1 flex-basis-0">
                <h3 className="mb-3">Your Cards</h3>

                <div className="filter-controls mb-3">
                    <Row>
                        <Col md={8}>
                            <Form.Control
                                type="text"
                                placeholder="Search cards by name or ability..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="color">Sort by Color</option>
                                <option value="name">Sort by Name</option>
                                <option value="power">Sort by Power</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </div>

                <CardDropArea onDrop={handleDropToAvailable} isDeckArea={false} title="Click or drag to add">
                    {sortedAndFilteredAvailableCards().length === 0 ? (
                        <div className="text-center text-muted p-5">
                            <i className="bi bi-collection fs-1"></i>
                            <p className="mt-3">No more cards available to add</p>
                        </div>
                    ) : (
                        sortedAndFilteredAvailableCards().map((card, index) => (
                            <DraggableCard
                                key={card.tempId}
                                card={card}
                                index={index}
                                moveCard={(dragIndex, hoverIndex) => moveCard('available-cards', dragIndex, hoverIndex)}
                                addToDeck={handleAddToDeck}
                                isDeckCard={false}
                                availableCopies={card.availableCopies}
                            />
                        ))
                    )}
                </CardDropArea>
            </div>
        </div>
    );

    return (
        <DndProvider backend={getDndBackend()} options={{
            enableMouseEvents: true,
            delayTouchStart: 250, // Delay drag for 250ms on touch (lets user scroll)
        }}>
            <div className="deck-editor-container vw-100 d-flex flex-column bg-light" style={{
                height: 'calc(100vh - 60px)',
                marginTop: '60px'
            }}>
                {/* Header */}
                <div className="deck-editor-header p-3 bg-white border-bottom shadow-sm d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                        <Button variant="light" onClick={() => navigate(-1)} className="me-3 d-none d-md-block">
                            &larr; Back
                        </Button>
                        <Button variant="light" onClick={() => navigate(-1)} className="me-2 d-md-none">
                            &larr;
                        </Button>
                        <Form.Group className="d-flex align-items-center mb-0">
                            <Form.Control
                                type="text"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                                className="me-2"
                                style={{ width: isMobileView ? '140px' : '200px' }}
                                placeholder="Deck Name"
                            />
                            <Button
                                variant="outline-primary"
                                onClick={handleSaveName}
                                disabled={isSaving}
                                size={isMobileView ? "sm" : "md"}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </Form.Group>
                    </div>
                    <div className="d-flex align-items-center">
                        <Button
                            variant="warning"
                            onClick={handleEmptyDeck}
                            disabled={deckCards.length === 0 || isSaving}
                            className="me-2"
                            size={isMobileView ? "sm" : "md"}
                        >
                            Empty
                        </Button>
                        <Button
                            variant="success"
                            onClick={saveDeckToServer}
                            disabled={!isDirty || isSaving}
                            size={isMobileView ? "sm" : "md"}
                        >
                            {isSaving ? 'Saving...' : 'Save Deck'}
                        </Button>
                    </div>
                </div>

                {/* Notification Area */}
                {error && (
                    <Alert
                        variant={error.includes("successfully") || error.includes("Added") ? "success" :
                            error.includes("emptied") || error.includes("Removed") ? "info" : "danger"}
                        onClose={() => setError(null)}
                        dismissible
                        className="m-2 mb-0"
                    >
                        {error}
                    </Alert>
                )}

                {/* Main Content - Switch between mobile and desktop views */}
                <div className="flex-grow-1 overflow-auto p-3">
                    {isMobileView ? mobileView : desktopView}
                </div>
            </div>

            {/* CSS for card interactions and animations */}
            <style jsx>{`
  .card-container {
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;
  }

  .card-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .card-drop-area {
    min-height: 200px;
    padding: 1rem;
    border-radius: 8px;
    border: 2px dashed #ddd;
    background-color: #f8f9fa;
    transition: all 0.2s ease;
  }

  .drop-highlight {
    border-color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.05);
  }

  .deck-area {
    background-color: rgba(248, 249, 250, 0.8);
  }

  .available-area {
    background-color: rgba(255, 255, 255, 0.8);
  }

  .card-action-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 20;
  }

  .card-container:hover .card-action-hint {
    opacity: 1;
  }

  .add-btn,
  .remove-btn {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .card-container:hover .add-btn,
  .card-container:hover .remove-btn {
    opacity: 1;
  }

  .card-area-container {
    margin-bottom: 2rem;
  }

  @media (max-width: 767.98px) {
    .deck-editor-mobile .card-drop-area {
      max-height: calc(100vh - 220px);
      overflow-y: auto;
    }

    .add-btn,
    .remove-btn {
      opacity: 1;
    }
  }
`}
            </style>
        </DndProvider>
    )
}


export default SSSDeckDetail;