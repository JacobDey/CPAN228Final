import { useEffect, useState } from "react";
import SSSCard from "./SSSCard.jsx";

function PlayerHand({ matchId, player }) {
  const [hand, setHand] = useState([]);

  useEffect(() => {
    const fetchHand = async () => {
      try {
        const response = await fetch(`http://localhost:8080/matches/${matchId}`);
        const matchData = await response.json();
        setHand(player === "player1" ? matchData.player1Hand : matchData.player2Hand);
      } catch (error) {
        console.error("Error fetching hand:", error);
      }
    };

    fetchHand();
  }, [matchId, player]);

  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      {hand.map((card) => (
        <SSSCard key={card.id} data={card} />
      ))}
    </div>
  );
}

export default PlayerHand;