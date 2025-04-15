import SSSCard from "./SSSCard";
import { Card } from "react-bootstrap";
import { useDrop } from "react-dnd";


const SSSTower = ({ tower, index, onCardPlayed, disabled }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "CARD",
        canDrop: () => !disabled,
        drop: (item) => onCardPlayed(item.card, index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });
  
    // Style for the tower based on drag state
    const borderStyle = isOver && canDrop 
        ? "3px solid green" 
        : isOver && !canDrop 
            ? "3px solid red"
            : tower.controllingPlayerId === 1 
                ? "border-danger" 
                : tower.controllingPlayerId === 2 
                    ? "border-primary" 
                    : "";

    // Determine card stacking offset and calculate container heights
    const stackOffsetY = 20; // Increased pixels between cards
    
    // Calculate container heights based on number of cards
    const player1CardsCount = tower.player1Cards?.length || 0;
    const player2CardsCount = tower.player2Cards?.length || 0;
    
    // Base height (180px) plus additional height for each card beyond the first
    const player1ContainerHeight = 280 + (Math.max(0, player1CardsCount - 1) * stackOffsetY);
    const player2ContainerHeight = 260 + (Math.max(0, player2CardsCount - 1) * stackOffsetY);

    // Calculate total power for each player on this tower
    const calculateTowerPower = (cards) => {
        if (!cards || cards.length === 0) return 0;
        return cards.reduce((total, card) => total + (card.power || 0), 0);
    };
    
    const player1Power = calculateTowerPower(tower.player1Cards);
    const player2Power = calculateTowerPower(tower.player2Cards);

    // Determine power display styles
    let player1PowerStyle = {};
    let player2PowerStyle = {};

    if (player1Power > player2Power) {
        player1PowerStyle = { fontWeight: 'bold', color: '#198754' }; // Green for winner
        player2PowerStyle = { color: '#dc3545' }; // Red for loser
    } else if (player2Power > player1Power) {
        player1PowerStyle = { color: '#dc3545' };
        player2PowerStyle = { fontWeight: 'bold', color: '#198754' };
    } else {
        // It's a tie (including 0-0)
        player1PowerStyle = { color: '#ffc107' }; // Yellow for tie
        player2PowerStyle = { color: '#ffc107' };
    }
  
    return (
        <div 
            ref={drop} 
            key={index} 
            className="tower-card text-center"
        >
            <Card className={`tower ${borderStyle}`} style={{
                transform: isOver && canDrop ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.2s',
                opacity: disabled ? 0.7 : 1
            }}>
                <Card.Header>Tower {index + 1}</Card.Header>
                <Card.Body>
                    
                    {/* Player 1 Cards Container with dynamic height - FIRST SECTION */}
                    <div className="mb-3">
                        <h6>Player 1 Cards:</h6>
                        <div 
                            className="tower-cards-container"
                            style={{ 
                                minHeight: `${player1ContainerHeight}px`,
                                height: `${player1ContainerHeight}px` 
                            }}
                        >
                            {tower.player1Cards && tower.player1Cards.length > 0 ? (
                                tower.player1Cards.map((card, cardIndex) => (
                                    <div 
                                        key={card.uid || `p1-card-${cardIndex}`}
                                        className="stacked-card"
                                        style={{
                                            top: `${cardIndex * stackOffsetY}px`,
                                            zIndex: tower.player1Cards.length - cardIndex
                                        }}
                                    >
                                        <SSSCard data={card} gameplay={true} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted">No cards</div>
                            )}
                        </div>
                    </div>
                    
                    {/* Power summary section - SECOND SECTION */}
                    <div className="power-summary p-3 mb-3 border rounded bg-light">
                        <div className="d-flex flex-column align-items-center">
                            <div style={player1PowerStyle} className="mb-2">Player 1 Power: {player1Power}</div>
                            <div className="mb-2">Victory Points: {tower.victoryPoints}</div>
                            <div style={player2PowerStyle}>Player 2 Power: {player2Power}</div>
                        </div>
                    </div>
                    
                    {/* Player 2 Cards Container with dynamic height - THIRD SECTION */}
                    <div>
                        <h6>Player 2 Cards:</h6>
                        <div 
                            className="tower-cards-container"
                            style={{ 
                                minHeight: `${player2ContainerHeight}px`,
                                height: `${player2ContainerHeight}px` 
                            }}
                        >
                            {tower.player2Cards && tower.player2Cards.length > 0 ? (
                                tower.player2Cards.map((card, cardIndex) => (
                                    <div 
                                        key={card.uid || `p2-card-${cardIndex}`}
                                        className="stacked-card"
                                        style={{
                                            top: `${cardIndex * stackOffsetY}px`,
                                            zIndex: tower.player2Cards.length - cardIndex
                                        }}
                                    >
                                        <SSSCard data={card} gameplay={true} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted">No cards</div>
                            )}
                        </div>
                    </div>
                    
                    {disabled && (
                        <div className="text-muted mt-2">
                            {isOver ? "Cannot play card here" : ""}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default SSSTower;