import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SSSNavbar from "../components/SSSNavbar";
import { useAuth } from "../components/SSSAuth";
import SSSPlayerHand from "../components/SSSPlayerHand";
import SSSTower from "../components/SSSTower";
import SSSMatchResultModal from "../components/SSSMatchResultModal";

function SSSGame() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { username } = useAuth();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const [cardsPlayedThisTurn, setCardsPlayedThisTurn] = useState(0);
    const [playStatus, setPlayStatus] = useState({ message: "", type: "" });
    const [showResultModal, setShowResultModal] = useState(false);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    // Fetch match data
    const fetchMatchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${SERVER_URL}/matches/${matchId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch match: ${response.statusText}`);
            }

            const data = await response.json();
            setMatch(data);
            setError(null);

            // Update the local counter with the server's value when it's your turn
            if (data.currentTurnPlayer === username) {
                // Use the server's counter value
                setCardsPlayedThisTurn(data.cardPlayedThisTurn || 0);
            }

            // Automatically start turn if it's BEGIN phase and player's turn
            if (data.currentTurnPlayer === username && data.currentPhase === "BEGIN") {
                handleStartTurn();
            }

            //check if game end, show modal
            if (data.status === "PLAYER1_WIN" || data.status === "PLAYER2_WIN" || data.status === "DRAW") {
                setShowResultModal(true);
            }

        } catch (err) {
            console.error("Error fetching match data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Set up polling interval
    useEffect(() => {
        // Initial fetch
        fetchMatchData();

        // Clean up any existing interval first
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Set up a new interval
        intervalRef.current = setInterval(() => {
            fetchMatchData();
        }, 3000);

        // Clean up on unmount or when matchId changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [matchId, username]); // Now depends on username as well

    // Handle playing a card on a tower
    const handlePlayCard = async (card, towerIndex) => {
        try {
            // If we've already played 3 cards, don't allow playing another
            if (cardsPlayedThisTurn >= 3) {
                setPlayStatus({
                    message: "Maximum 3 cards per turn reached",
                    type: "warning"
                });
                setTimeout(() => setPlayStatus({ message: "", type: "" }), 3000);
                return;
            }

            setPlayStatus({ message: "Playing card...", type: "info" });

            // Ensure we have a valid card ID - prioritize uid, but use id if uid is not available
            const cardId = card.uid || card.id;
            if (!cardId) {
                throw new Error("Invalid card: Missing identifier");
            }

            // Optimistically update the UI counter for immediate feedback
            setCardsPlayedThisTurn(prev => prev + 1);

            const token = localStorage.getItem("token");
            const response = await fetch(`${SERVER_URL}/matches/${matchId}/play?cardId=${cardId}&towerId=${towerIndex + 1}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If the server rejected the move, roll back our optimistic update
                setCardsPlayedThisTurn(prev => prev - 1);
                const errorText = await response.text();
                throw new Error(errorText || `Failed to play card: ${response.statusText}`);
            }

            // Get updated match data
            const updatedMatch = await response.json();

            // Update the match state with new data
            setMatch(updatedMatch);

            // Clear status after successful play
            setPlayStatus({ message: "Card played successfully!", type: "success" });
            setTimeout(() => setPlayStatus({ message: "", type: "" }), 3000);

        } catch (err) {
            console.error("Error playing card:", err);
            setPlayStatus({
                message: err.message || "Failed to play card",
                type: "danger"
            });
            setTimeout(() => setPlayStatus({ message: "", type: "" }), 5000);
        }
    };

    // Start the player's turn
    const handleStartTurn = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${SERVER_URL}/matches/${matchId}/startTurn`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // Reset cards played counter
            setCardsPlayedThisTurn(0);

            // Refresh match data
            fetchMatchData();
        } catch (err) {
            console.error("Error starting turn:", err);
            setError(err.message);
        }
    };

    // End the player's turn
    const handleEndTurn = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${SERVER_URL}/matches/${matchId}/end`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // Refresh match data
            fetchMatchData();
        } catch (err) {
            console.error("Error ending turn:", err);
            setError(err.message);
        }
    };

    // Leave/Exit game
    const handleExitGame = () => {
        navigate('/battle');
    };

    // Check if the current user is player1 or player2
    const getPlayerRole = () => {
        if (!match || !username) return null;
        if (match.player1 === username) return "player1";
        if (match.player2 === username) return "player2";
        return "spectator";
    };

    // Determine if it's the current player's turn
    const isMyTurn = () => {
        return match && match.currentTurnPlayer === username && match.currentPhase === "MAIN";
    };

    // Get opponent username
    const getOpponentName = () => {
        if (!match || !username) return "Opponent";
        return match.player1 === username ? match.player2 : match.player1;
    };

    if (loading) {
        return (
            <>
                <SSSNavbar />
                <Container className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading game...</p>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <SSSNavbar />
                <Container className="py-5">
                    <Alert variant="danger">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>{error}</p>
                        <Button variant="outline-danger" onClick={handleExitGame}>
                            Return to Battle Screen
                        </Button>
                    </Alert>
                </Container>
            </>
        );
    }

    if (!match) {
        return (
            <>
                <SSSNavbar />
                <Container className="py-5">
                    <Alert variant="warning">
                        <Alert.Heading>Match Not Found</Alert.Heading>
                        <p>The match you're looking for doesn't exist or has ended.</p>
                        <Button variant="outline-warning" onClick={handleExitGame}>
                            Return to Battle Screen
                        </Button>
                    </Alert>
                </Container>
            </>
        );
    }

    const playerRole = getPlayerRole();
    const myTurn = isMyTurn();

    return (
        <DndProvider backend={HTML5Backend}>
            <SSSNavbar />
            <Container fluid className="game-container py-3 pb-5">
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <h1>Match #{matchId}</h1>
                            <div>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleExitGame}
                                >
                                    Exit Game
                                </Button>
                            </div>
                        </div>
                        <div className="game-status-bar d-flex justify-content-between bg-light p-2 rounded">
                            <div>
                                <strong>Turn:</strong> {match.turn}
                                {myTurn && (
                                    <span className="badge bg-success ms-2">Your Turn</span>
                                )}
                            </div>
                            <div>
                                <strong>Status:</strong> {match.status}
                            </div>
                            <div>
                                <strong>Phase:</strong> {match.currentPhase}
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Status messages */}
                {playStatus.message && (
                    <Row className="mb-3">
                        <Col>
                            <Alert variant={playStatus.type} dismissible onClose={() => setPlayStatus({ message: "", type: "" })}>
                                {playStatus.message}
                            </Alert>
                        </Col>
                    </Row>
                )}

                {/* Game Board Area */}
                <Row className="mb-50">
                    <Col>
                        <Card className="game-board">
                            <Card.Body>
                                <h2 className="text-center mb-4">Game Board</h2>

                                {/* Opponent's info */}
                                <div className="opponent-area mb-4 p-3 bg-light rounded">
                                    <h3>{getOpponentName()}</h3>
                                    <p>Hand: {match.player1 === username ? match.player2Hand?.length : match.player1Hand?.length} cards</p>
                                    <p>Deck: {match.player1 === username ? match.player2Deck?.length : match.player1Deck?.length} cards</p>
                                </div>

                                {/* Towers with drop targets */}
                                <div className="towers-area d-flex justify-content-around my-5">
                                    {match.towers?.map((tower, index) => (
                                        <SSSTower
                                            key={index}
                                            tower={tower}
                                            index={index}
                                            onCardPlayed={handlePlayCard}
                                            disabled={!myTurn || cardsPlayedThisTurn >= 3}
                                        />
                                    ))}
                                </div>

                                {/* Cards played counter */}
                                <div className="text-center mb-3">
                                    <span className="badge bg-info">
                                        Cards played this turn: {cardsPlayedThisTurn} / 3
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Game log and fixed End Turn Button */}
                {/* ... existing game log code ... */}
            </Container>

            {/* Fixed End Turn button */}
            {myTurn && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "340px",
                        right: "90px",
                        zIndex: 1001
                    }}
                >
                    <Button
                        variant="success"
                        size="lg"
                        onClick={handleEndTurn}
                        style={{
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            padding: "12px 24px",
                            borderRadius: "8px"
                        }}
                    >
                        End Turn
                    </Button>
                </div>
            )}

            {/* Player hand fixed to bottom */}
            <SSSPlayerHand
                matchId={matchId}
                player={playerRole}
                isMyTurn={myTurn}
                cardsPlayedThisTurn={cardsPlayedThisTurn}
                gamePhase={match.currentPhase}
                username={username}
                currentTurnPlayer={match.currentTurnPlayer}
                match={match}
            />

            {/* Match Result Modal */}
            <SSSMatchResultModal
                show={showResultModal}
                match={match}
                username={username}
            />
        </DndProvider>
    );
}

export default SSSGame;