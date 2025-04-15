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
                const response = await fetch("http://localhost:8080/matches/ongoing", {
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

    // SSSMatchBrowser.jsx - Add a loading state and prevent multiple requests
const [isJoining, setIsJoining] = useState(false);

const handleJoinMatch = async (matchId) => {
    if (isJoining) return; // Prevent multiple clicks
    
    try {
        setIsJoining(true);
        const token = localStorage.getItem("token");
        
        // Use joinOngoing endpoint for matches in progress
        const response = await fetch(`http://localhost:8080/matches/${matchId}/joinOngoing`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const match = await response.json();
        // Redirect to game instead of showing alert
        window.location.href = `/game/${matchId}`;
    } catch (error) {
        console.error("Error joining match:", error);
        alert("Failed to join match. Please try again.");
    } finally {
        setIsJoining(false);
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