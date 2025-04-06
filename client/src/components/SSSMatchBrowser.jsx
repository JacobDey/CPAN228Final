// currently unused match browser, for now i'm just going to assume the user will only ever be in one match at once
import { useEffect, useState } from "react";
import { useAuth } from "./SSSAuth";

function SSSMatchBrowser() {
  const [matches, setMatches] = useState([]);
  const { username } = useAuth(); // Get the logged-in user's username

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        console.log("Token:", token); // Log the token for debugging
        const response = await fetch("http://localhost:8080/matches", {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        const userMatches = data.filter(
          (match) => match.player1 === username || match.player2 === username
        );
        setMatches(userMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [username]);

  const handleJoinMatch = async (matchId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await fetch(`http://localhost:8080/matches/${matchId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const match = await response.json();
      console.log("Joined match:", match);
      alert(`Successfully joined match with ID: ${match.id}`);
    } catch (error) {
      console.error("Error joining match:", error);
      alert("Failed to join match. Please try again.");
    }
  };

  return (
    <div>
      <h2>Your Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id} style={{ marginBottom: "10px" }}>
            <p>Opponent: {match.player1 === username ? match.player2 : match.player1}</p>
            <p>Turn: {match.turn}</p>
            <button onClick={() => handleJoinMatch(match.id)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SSSMatchBrowser;