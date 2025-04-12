import { useEffect, useState } from "react";
import SSSCard from "./SSSCard.jsx";

function PlayerHand({ matchId, player }) {
  const [hand, setHand] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchHand();
  }, [matchId, player]);

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      {hand && hand.length > 0 ? (
        hand.map((card) => (
          <SSSCard key={card.id} data={card} />
        ))
      ) : (
        <div>No cards in hand</div>
      )}
    </div>
  );
}

export default PlayerHand;