import { useEffect, useState } from "react";
import SSSCard from "./SSSCard.jsx";
import { useDrag } from "react-dnd";

// Create a draggable card component that wraps SSSCard
const DraggableCard = ({ card, isMyTurn, cardsPlayedThisTurn, gamePhase, isCurrentPlayer }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id: card.id, card },
    canDrag: () => isMyTurn && cardsPlayedThisTurn < 3,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Determine card state and message
  let overlayStyle = null;
  let message = "";

  if (!isCurrentPlayer) {
    overlayStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px"
    };
    message = "Not Your Turn";
  } else if (gamePhase === "BEGIN") {
    overlayStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px"
    };
    message = "Begin Phase";
  } else if (isMyTurn && cardsPlayedThisTurn >= 3) {
    overlayStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      borderRadius: "8px"
    };
    message = "Max Cards Played";
  }

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isMyTurn && cardsPlayedThisTurn < 3 ? "grab" : "not-allowed",
        position: "relative"
      }}
    >
      <SSSCard data={card} />
      {overlayStyle && (
        <div style={overlayStyle}>
          {message}
        </div>
      )}
    </div>
  );
};

function PlayerHand({ matchId, player, isMyTurn, cardsPlayedThisTurn = 0, gamePhase, username, currentTurnPlayer, match }) {
  const [hand, setHand] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch hand data
  const fetchHand = async () => {
    try {
      // Skip fetch if matchId isn't available yet
      if (!matchId) {
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`http://localhost:8080/matches/${matchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError("Not authorized to view this match");
          return;
        }
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const text = await response.text();
      // Check if response is empty
      if (!text) {
        setHand([]);
        return;
      }

      const matchData = JSON.parse(text);
      setHand(player === "player1" ? matchData.player1Hand || [] : matchData.player2Hand || []);
    } catch (error) {
      console.error("Error fetching hand:", error);
      setError("Failed to load hand data");
    }
  };

  // If we already have the match data passed in, use it directly
  useEffect(() => {
    if (match) {
      setHand(player === "player1" ? match.player1Hand || [] : match.player2Hand || []);
    } else {
      fetchHand();
    }
  }, [match, player, matchId]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  const isCurrentPlayer = currentTurnPlayer === username;

  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px", flexWrap: "wrap" }}>
      {hand && hand.length > 0 ? (
        hand.map((card) => (
          <DraggableCard 
            key={card.uid || card.id} 
            card={card} 
            isMyTurn={isMyTurn}
            cardsPlayedThisTurn={cardsPlayedThisTurn}
            gamePhase={gamePhase}
            isCurrentPlayer={isCurrentPlayer}
          />
        ))
      ) : (
        <div>No cards in hand</div>
      )}
    </div>
  );
}

export default PlayerHand;