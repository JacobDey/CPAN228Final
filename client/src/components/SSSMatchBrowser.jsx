import React, { useEffect, useState } from 'react';
import { useAuth } from './SSSAuth';
import './SSSMatchBrowser.css';

function SSSMatchBrowser() {
    const [matches, setMatches] = useState([]);
    const { username } = useAuth();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:8080/matches", {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/matches/${matchId}/join`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const match = await response.json();
            alert(`Successfully joined match: ${match.id}`);
        } catch (error) {
            console.error("Error joining match:", error);
            alert("Failed to join match. Please try again.");
        }
    };

    return (
        <div className="match-browser-container">
            {matches.map((match) => (
                <div key={match.id} className="match-card">
                    <p>Opponent: {match.player1 === username ? match.player2 : match.player1}</p>
                    <p>Turn: {match.turn}</p>
                    <button onClick={() => handleJoinMatch(match.id)}>Join Existing Match</button>
                </div>
            ))}
        </div>
    );
}

export default SSSMatchBrowser;