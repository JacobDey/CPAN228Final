import { useEffect, useState, useRef } from "react";
import SSSCard from "./SSSCard.jsx";
import { useDrag } from "react-dnd";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
const MAX_CARDS_PER_TURN = 3;

// Create a draggable card component that wraps SSSCard
const DraggableCard = ({ card, isMyTurn, cardsPlayedThisTurn, gamePhase, isCurrentPlayer }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id: card.id, card },
    canDrag: () => isMyTurn && cardsPlayedThisTurn < MAX_CARDS_PER_TURN,
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
  } else if (isMyTurn && cardsPlayedThisTurn >= MAX_CARDS_PER_TURN) {
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
        cursor: isMyTurn && cardsPlayedThisTurn < MAX_CARDS_PER_TURN ? "grab" : "not-allowed",
        position: "relative",
        margin: "0 5px"
      }}
    >
      <SSSCard data={card} gameplay={true} />
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // State to track if user is in the scroll zones
  const [scrollDirection, setScrollDirection] = useState(null); 
  const scrollSpeed = 5; // pixels per animation frame
  const scrollInterval = useRef(null);
  const [isLeftZoneHovered, setIsLeftZoneHovered] = useState(false);
  const [isRightZoneHovered, setIsRightZoneHovered] = useState(false);

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

      const response = await fetch(`${SERVER_URL}/matches/${matchId}`, {
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

  // Scroll functionality
  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollZoneWidth = 90; // Width of scroll zones on each side
    const mouseX = e.clientX - rect.left;
    
    // Check if mouse is in left scroll zone
    const isInLeftZone = mouseX < scrollZoneWidth;
    const isInRightZone = mouseX > rect.width - scrollZoneWidth;
    
    setIsLeftZoneHovered(isInLeftZone);
    setIsRightZoneHovered(isInRightZone);
    
    // Check if mouse is in left scroll zone
    if (isInLeftZone) {
      setScrollDirection('left');
    } 
    // Check if mouse is in right scroll zone
    else if (isInRightZone) {
      setScrollDirection('right');
    } 
    // Not in a scroll zone
    else {
      setScrollDirection(null);
    }
  };

  const handleMouseLeave = () => {
    setScrollDirection(null);
    setIsLeftZoneHovered(false);
    setIsRightZoneHovered(false);
  };

  // Set up auto-scrolling based on scroll direction
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (scrollDirection) {
      // Clear any existing interval
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
      
      // Set new interval for scrolling
      scrollInterval.current = setInterval(() => {
        if (scrollDirection === 'left') {
          container.scrollLeft = Math.max(container.scrollLeft - scrollSpeed, 0);
          setScrollPosition(container.scrollLeft);
        } else {
          container.scrollLeft = Math.min(
            container.scrollLeft + scrollSpeed,
            container.scrollWidth - container.clientWidth
          );
          setScrollPosition(container.scrollLeft);
        }
      }, 16); // roughly 60fps
    } else if (scrollInterval.current) {
      // Clear interval when not in a scroll zone
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [scrollDirection]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  const isCurrentPlayer = currentTurnPlayer === username;

  return (
    <div 
      className="player-hand-fixed" 
      style={{ 
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "340px", // Height for gameplay card (280px) + padding
        background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3) 70%, transparent)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        zIndex: 1000
      }}
    >
      {/* Scroll bar */}
      <div 
        className="scroll-indicator" 
        style={{
          height: "5px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.1)",
          position: "relative",
          marginBottom: "5px"
        }}
      >
        {scrollContainerRef.current && (
          <div 
            style={{
              position: "absolute",
              left: `${(scrollPosition / (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)) * 100 || 0}%`,
              width: `${(scrollContainerRef.current.clientWidth / scrollContainerRef.current.scrollWidth) * 100 || 100}%`,
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: "3px",
              transform: "translateX(-50%)", 
              opacity: hand.length > 0 ? 1 : 0,
              transition: "opacity 0.3s ease"
            }}
          ></div>
        )}
      </div>

      {/* Left scroll zone - always present but with varying opacity */}
      <div 
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "90px",
          height: "100%",
          background: "linear-gradient(to right, rgba(0,0,0,0.3), transparent)",
          zIndex: 1001,
          opacity: isLeftZoneHovered ? 1 : 0,
          transition: "opacity 0.2s ease-out",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ color: "white", opacity: 0.7 }}>◀</div>
      </div>

      {/* Right scroll zone - always present but with varying opacity */}
      <div 
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "90px",
          height: "100%",
          background: "linear-gradient(to left, rgba(0,0,0,0.3), transparent)",
          zIndex: 1001,
          opacity: isRightZoneHovered ? 1 : 0,
          transition: "opacity 0.2s ease-out",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ color: "white", opacity: 0.7 }}>▶</div>
      </div>

      {/* Scrollable cards container */}
      <div 
        ref={scrollContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          overflowX: "auto", 
          overflowY: "hidden",
          display: "flex", 
          paddingBottom: "15px",
          paddingLeft: "10px",
          paddingRight: "10px",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer/Edge
        }}
        className="no-scrollbar" // Custom class to hide scrollbar in WebKit browsers
      >
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
          <div style={{ color: "white", padding: "20px", textAlign: "center", width: "100%" }}>No cards in hand</div>
        )}
      </div>
    </div>
  );
}

export default PlayerHand;