import SSSNavbar from "../components/SSSNavbar.jsx";
import SSSMatchBrowser from "../components/SSSMatchBrowser.jsx";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../components/SSSAuth.jsx';

function SSSBattle() {
    const navigate = useNavigate();
    const { username } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [matchId, setMatchId] = useState('');
    const [aiDifficulty, setAiDifficulty] = useState('easy');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createdMatch, setCreatedMatch] = useState(null);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    const handleCreateMatch = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch(`${SERVER_URL}/matches/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to create match: ${response.statusText}`);
            }

            const match = await response.json();
            setCreatedMatch(match);
        } catch (error) {
            console.error('Error creating match:', error);
            setError(error.message || 'Failed to create match');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinMatch = async () => {
        if (!matchId.trim()) {
            setError('Please enter a match ID');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch(`${SERVER_URL}/matches/${matchId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to join match: ${response.statusText}`);
            }

            const match = await response.json();

            // Navigate to game screen with the match ID
            navigate(`/game/${matchId}`);
        } catch (error) {
            console.error('Error joining match:', error);
            setError(error.message || 'Failed to join match');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAIMatch = async (difficulty) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch(`${SERVER_URL}/ai/playWithAI?difficulty=${difficulty}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to create AI match: ${response.statusText}`);
            }

            const match = await response.json();
            navigate(`/game/${match.id}`);
        } catch (error) {
            console.error('Error creating AI match:', error);
            setError(error.message || 'Failed to create AI match');
        } finally {
            setIsLoading(false);
        }
    };

    const startGame = () => {
        if (createdMatch && createdMatch.id) {
            navigate(`/game/${createdMatch.id}`);
        }
    };

    return (
        <>
            <SSSNavbar />
            <h1>Battle!</h1>
            <div className="battle-buttons-container">
                <button
                    className="battle-button create-match-button"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Match
                </button>
                <button
                    className="battle-button join-match-button"
                    onClick={() => setShowJoinModal(true)}
                >
                    Join Match
                </button>
                <button
                    className="battle-button ai-battle-button"
                    onClick={() => setShowAIModal(true)}
                >
                    Battle Against AI
                </button>
            </div>
            <SSSMatchBrowser />

            {/* AI Battle Modal */}
            <Modal show={showAIModal} onHide={() => setShowAIModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose AI Difficulty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Creating AI match...</p>
                        </div>
                    ) : (
                        <>
                            <p>Select the difficulty level for your AI opponent:</p>
                            <Form.Group className="mb-3">
                                <Form.Select
                                    value={aiDifficulty}
                                    onChange={(e) => setAiDifficulty(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="easy">Easy - For New Players</option>
                                    <option value="medium">Medium - For Experienced Players</option>
                                    <option value="hard">Hard - For Expert Players</option>
                                </Form.Select>
                            </Form.Group>
                            {error && <Alert variant="danger">{error}</Alert>}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAIModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleCreateAIMatch(aiDifficulty)}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Start Battle'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create Match Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Match</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Creating match...</p>
                        </div>
                    ) : createdMatch ? (
                        <div>
                            <Alert variant="success">
                                <Alert.Heading>Match Created!</Alert.Heading>
                                <p>
                                    Your match has been created successfully. Share this ID with your opponent:
                                </p>
                                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                    <code className="fs-5">{createdMatch.id}</code>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(createdMatch.id);
                                            alert('Match ID copied to clipboard!');
                                        }}
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <hr />
                                <p className="mb-0">
                                    Waiting for opponent to join...
                                </p>
                            </Alert>
                        </div>
                    ) : (
                        <>
                            <p>
                                Create a new match and invite another player to join.
                                You will receive a match ID that you can share with your opponent.
                            </p>
                            {error && <Alert variant="danger">{error}</Alert>}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {createdMatch ? (
                        <div className="w-100 d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={startGame}>
                                Enter Game
                            </Button>
                        </div>
                    ) : (
                        <div className="w-100 d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateMatch}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Match'}
                            </Button>
                        </div>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Join Match Modal */}
            <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Join Match</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Joining match...</p>
                        </div>
                    ) : (
                        <>
                            <p>
                                Enter the match ID provided by the player who created the match.
                            </p>
                            <Form.Group className="mb-3">
                                <Form.Label>Match ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={matchId}
                                    onChange={(e) => setMatchId(e.target.value)}
                                    placeholder="Enter match ID"
                                />
                            </Form.Group>
                            {error && <Alert variant="danger">{error}</Alert>}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleJoinMatch}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Joining...' : 'Join Match'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SSSBattle;