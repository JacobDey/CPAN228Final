import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../components/SSSAuth";
import SSSCard from '../components/SSSCard';
import axios from 'axios';

function SSSProfile() {
  const [profile, setProfile] = useState(null);
  const [cardDetails, setCardDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0
  });
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const SERVER_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const profileResponse = await axios.get(`${SERVER_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(profileResponse.data);
        
        // Calculate match statistics
        if (profileResponse.data.matchesHistory && profileResponse.data.matchesHistory.length > 0) {
          calculateMatchStats(profileResponse.data.matchesHistory);
        }
        
        // Fetch card details for cards in user's collection
        if (profileResponse.data.cards && Object.keys(profileResponse.data.cards).length > 0) {
          const cardIds = Object.keys(profileResponse.data.cards);
          
          const cardsResponse = await axios.post(`${SERVER_URL}/card/cardByIds`, cardIds, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setCardDetails(cardsResponse.data);
        }
      } catch (err) {
        if (err.status === 400) {
            alert("Please Login");
            navigate("/login");
        }
        console.error("Error fetching profile data:", err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const calculateMatchStats = (matches) => {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    
    matches.forEach(match => {
      // Determine if the user is player1 or player2
      const isPlayer1 = match.player1 === profile.username;
      
      if (match.status === 'PLAYER1_WIN' && isPlayer1) wins++;
      else if (match.status === 'PLAYER2_WIN' && !isPlayer1) wins++;
      else if (match.status === 'PLAYER1_WIN' && !isPlayer1) losses++;
      else if (match.status === 'PLAYER2_WIN' && isPlayer1) losses++;
      else if (match.status === 'DRAW') draws++;
    });
    
    const totalMatches = matches.length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
    
    setStats({
      wins,
      losses,
      draws,
      winRate
    });
  };

  const getMatchResultDisplay = (match) => {
    const isPlayer1 = profile.username === match.player1;
    
    switch(match.status) {
      case 'PLAYER1_WIN':
        return isPlayer1 ? 
          <Badge bg="success">Win</Badge> : 
          <Badge bg="danger">Loss</Badge>;
      case 'PLAYER2_WIN':
        return isPlayer1 ? 
          <Badge bg="danger">Loss</Badge> : 
          <Badge bg="success">Win</Badge>;
      case 'DRAW':
        return <Badge bg="warning">Draw</Badge>;
      case 'PLAYING':
        return <Badge bg="info">In Progress</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getOpponentName = (match) => {
    return profile.username === match.player1 ? match.player2 : match.player1;
  };

  const getMatchScore = (match) => {
    return `${match.player1Score} - ${match.player2Score}`;
  };

  const handleGoToAdmin = () => {
    if(profile.role != "ADMIN") {
      alert("You must be an admin to access this page");
      return;
    }
    navigate('/admin/edit/cards');
  }

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <h2>Loading profile...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {profile && (
        <>
          <Row className="mb-4">
            <Col>
              <Card className="profile-header shadow">
                <Card.Body>
                  <Row>
                    <Col md={3} className="text-center">
                      <div className="profile-avatar mb-3">
                        {/* Placeholder avatar circle with user's first letter */}
                        <div 
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                          style={{ width: '100px', height: '100px', margin: '0 auto', color: 'white', fontSize: '2.5rem' }}
                        >
                          {profile.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h4>{profile.username}</h4>
                      <p className="text-muted">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
                      {profile.role==="ADMIN" && <Button onClick={handleGoToAdmin}>Go to Admin Page</Button>} 
                    </Col>
                    <Col md={9}>
                      <h3>Battle Statistics</h3>
                      <Row className="mt-3 text-center">
                        <Col>
                          <div className="stat-box p-3 border rounded bg-light">
                            <h2 className="text-success">{stats.wins}</h2>
                            <p className="mb-0">Wins</p>
                          </div>
                        </Col>
                        <Col>
                          <div className="stat-box p-3 border rounded bg-light">
                            <h2 className="text-danger">{stats.losses}</h2>
                            <p className="mb-0">Losses</p>
                          </div>
                        </Col>
                        <Col>
                          <div className="stat-box p-3 border rounded bg-light">
                            <h2 className="text-warning">{stats.draws}</h2>
                            <p className="mb-0">Draws</p>
                          </div>
                        </Col>
                        <Col>
                          <div className="stat-box p-3 border rounded bg-light">
                            <h2>{stats.winRate}%</h2>
                            <p className="mb-0">Win Rate</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Tabs defaultActiveKey="cards" className="mb-4">
            <Tab eventKey="cards" title="Card Collection">
              <Row className="mt-3 bg-white">
                <Col>
                  <h3>Card Collection ({cardDetails.length})</h3>
                  <p>Below are all the cards you currently own:</p>
                  
                  <div className="card-collection mt-3">
                    <Row>
                      {cardDetails.map(card => (
                        <Col xs={12} md={6} lg={4} key={card.id} className="mb-3">
                          <SSSCard data={card} />
                          {profile.cards[card.id] > 1 && (
                            <Badge bg="secondary" className="ms-2 quantity-badge">
                              x{profile.cards[card.id]}
                            </Badge>
                          )}
                        </Col>
                      ))}
                      
                      {cardDetails.length === 0 && (
                        <Col xs={12}>
                          <Alert variant="info">
                            You don't have any cards yet. Visit the <Button variant="link" onClick={() => navigate('/booster')}>Booster Pack</Button> section to get your first cards!
                          </Alert>
                        </Col>
                      )}
                    </Row>
                  </div>
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="matches" title="Match History">
              <Row className="mt-3 bg-white">
                <Col>
                  <h3>Recent Battles</h3>
                  
                  <Table striped bordered hover responsive className="mt-3">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Result</th>
                        <th>Score</th>
                        <th>Turns</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.matchesHistory && profile.matchesHistory.map((match, index) => (
                        <tr key={index}>
                          <td>{new Date(match.createdAt).toLocaleString()}</td>
                          <td>{getOpponentName(match)}</td>
                          <td>{getMatchResultDisplay(match)}</td>
                          <td>{getMatchScore(match)}</td>
                          <td>{match.turn}</td>
                        </tr>
                      ))}
                      
                      {(!profile.matchesHistory || profile.matchesHistory.length === 0) && (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No matches played yet. Go to the <Button variant="link" onClick={() => navigate('/battle')}>Battle Arena</Button> to play your first match!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="decks" title="My Decks">
              <Row className="mt-3 bg-white">
                <Col>
                  <div className="d-flex justify-content-between align-items-center">
                    <h3>My Decks</h3>
                    <Button variant="primary" onClick={() => navigate('/decks')}>Manage Decks</Button>
                  </div>
                  
                  {profile.decks && profile.decks.length > 0 ? (
                    <Row className="mt-3">
                      {profile.decks.map(deck => (
                        <Col xs={12} md={6} lg={4} key={deck.id} className="mb-3">
                          <Card className={profile.selectedDeck && deck.id === profile.selectedDeck.id ? 'border-success' : ''}>
                            <Card.Body>
                              <Card.Title>{deck.name}</Card.Title>
                              <Card.Text>
                                {profile.selectedDeck && deck.id === profile.selectedDeck.id && (
                                  <Badge bg="success" className="me-2">Selected</Badge>
                                )}
                                <Badge bg="primary">{Object.values(deck.cardList || {}).reduce((sum, count) => sum + count, 0)} Cards</Badge>
                              </Card.Text>
                              <Button 
                                variant="outline-primary" 
                                onClick={() => navigate(`/decks/${deck.id}`)}
                              >
                                View Deck
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="info" className="mt-3">
                      You haven't created any decks yet. Go to the <Button variant="link" onClick={() => navigate('/decks')}>Decks</Button> section to create your first deck!
                    </Alert>
                  )}
                </Col>
              </Row>
            </Tab>
          
          </Tabs>
        </>
      )}
    </Container>
  );
}

export default SSSProfile;