import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import SSSNavbar from "../components/SSSNavbar";
import { useAuth } from "../components/SSSAuth";
import SSSPlayerHand from "../components/SSSPlayerHand";

function SSSGame() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { username } = useAuth();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshInterval, setRefreshInterval] = useState(null);

    // Fetch match data
    const fetchMatchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/matches/${matchId}`, {
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
            
            // Check if both players have joined
            if (data.player1 && data.player2) {
                // Set up auto-refresh when both players are in
                if (!refreshInterval) {
                    const interval = setInterval(() => {
                        fetchMatchData();
                    }, 3000); // Refresh every 3 seconds
                    setRefreshInterval(interval);
                }
            }
        } catch (err) {
            console.error("Error fetching match data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchMatchData();

        // Clean up interval on unmount
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [matchId]);

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
        return match && match.currentTurnPlayer === username;
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

    return (
        <>
            <SSSNavbar />
            <Container fluid className="game-container py-3">
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
                                {isMyTurn() && (
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

                {/* Game Board Area - This is where you'll implement the actual gameplay UI */}
                <Row className="mb-3">
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

                                {/* Towers */}
                                <div className="towers-area d-flex justify-content-around my-5">
                                    {match.towers?.map((tower, index) => (
                                        <div key={index} className="tower-card text-center">
                                            <Card className={`tower ${tower.controllingPlayerId === 1 ? 'border-danger' : tower.controllingPlayerId === 2 ? 'border-primary' : ''}`}>
                                                <Card.Header>Tower {index + 1}</Card.Header>
                                                <Card.Body>
                                                    <div className="mb-2">Victory Points: {tower.victoryPoints}</div>
                                                    <div className="mb-2">
                                                        Player 1 Cards: {tower.player1Cards?.length || 0}
                                                    </div>
                                                    <div>
                                                        Player 2 Cards: {tower.player2Cards?.length || 0}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))}
                                </div>

                                {/* Player's Hand */}
                                <div className="player-hand-area mt-4">
                                    <h3>Your Hand</h3>
                                    <SSSPlayerHand 
                                        matchId={matchId} 
                                        player={playerRole} 
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Game Controls */}
                <Row>
                    <Col className="d-flex justify-content-center gap-3">
                        <Button variant="outline-primary" disabled={!isMyTurn()}>
                            Start Turn
                        </Button>
                        <Button variant="outline-success" disabled={!isMyTurn()}>
                            End Turn
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SSSGame;