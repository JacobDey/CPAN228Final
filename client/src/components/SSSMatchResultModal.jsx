// Create a new component file: SSSMatchResultModal.jsx

import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SSSMatchResultModal = ({ show, match, username }) => {
    const navigate = useNavigate();
    
    // Determine match outcome for the current user
    const getMatchOutcome = () => {
        if (!match || !username) return { title: "Match Ended", message: "", variant: "primary" };
        
        // Get player scores
        const player1Score = match.player1Score || 0;
        const player2Score = match.player2Score || 0;
        
        // Determine if current user is player1 or player2
        const isPlayer1 = match.player1 === username;
        const myScore = isPlayer1 ? player1Score : player2Score;
        const opponentScore = isPlayer1 ? player2Score : player1Score;
        
        // Determine outcome and return appropriate message and styling
        if (myScore > opponentScore) {
            return {
                title: "GLORIOUS VICTORY!",
                message: "Your strategic brilliance has prevailed!",
                variant: "success",
                effect: "win"
            };
        } else if (myScore < opponentScore) {
            return {
                title: "CRUSHING DEFEAT",
                message: "Better luck in your next battle...",
                variant: "danger",
                effect: "lose"
            };
        } else {
            return {
                title: "HONORABLE DRAW",
                message: "Two masters, perfectly matched!",
                variant: "warning",
                effect: "draw"
            };
        }
    };
    
    const outcome = getMatchOutcome();
    
    // Handler for returning to home
    const handleReturnHome = () => {
        navigate('/');
    };
    
    // Get opponent name
    const getOpponentName = () => {
        if (!match || !username) return "Opponent";
        return match.player1 === username ? match.player2 : match.player1;
    };
    
    if (!match) return null;
    
    // Determine header background class based on outcome
    const getHeaderStyles = () => {
        switch(outcome.effect) {
            case 'win': return 'from-indigo-600 to-purple-700';
            case 'lose': return 'from-red-700 to-red-900';
            case 'draw': return 'from-amber-500 to-yellow-600';
            default: return 'from-blue-600 to-blue-700';
        }
    };
    
    // Determine button style based on outcome
    const getButtonClasses = () => {
        switch(outcome.effect) {
            case 'win': return 'bg-indigo-600 hover:bg-indigo-700 text-white';
            case 'lose': return 'bg-red-600 hover:bg-red-700 text-white';
            case 'draw': return 'bg-amber-500 hover:bg-amber-600 text-white';
            default: return 'bg-blue-600 hover:bg-blue-700 text-white';
        }
    };
    
    // Get the appropriate icon and effects for each outcome
    const getEffectElements = () => {
        switch(outcome.effect) {
            case 'win':
                return {
                    icon: '👑',
                    message: "Hail to the victor! Your name shall be recorded in the annals of Triple Siege legend!",
                    symbolClass: 'text-yellow-500'
                };
            case 'lose':
                return {
                    icon: '⚔️',
                    message: "Even the greatest strategists face defeat. Your next conquest awaits!",
                    symbolClass: 'text-red-500'
                };
            case 'draw':
                return {
                    icon: '⚖️',
                    message: "A battle for the ages! Two minds in perfect balance!",
                    symbolClass: 'text-amber-500'
                };
            default:
                return {
                    icon: '🏆',
                    message: "The battle is concluded!",
                    symbolClass: 'text-blue-500'
                };
        }
    };
    
    const effectElements = getEffectElements();
    
    // Calculate match duration in minutes
    const getMatchDuration = () => {
        if (!match.createdAt) return 'Unknown';
        const durationMinutes = Math.round((new Date() - new Date(match.createdAt)) / 60000);
        
        if (durationMinutes < 1) {
            return 'Less than a minute';
        } else if (durationMinutes === 1) {
            return '1 minute';
        } else {
            return `${durationMinutes} minutes`;
        }
    };
    
    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            centered
            size="lg"
            contentClassName="rounded-lg shadow-2xl border-0 overflow-hidden"
        >
            {/* Epic Header Section */}
            <div className={`bg-gradient-to-r ${getHeaderStyles()} relative overflow-hidden`}>
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full transform -translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 translate-y-16"></div>
                </div>
                
                <div className="px-6 py-8 relative z-10 text-center">
                    <div className="flex justify-center mb-3">
                        <span className={`text-5xl ${effectElements.symbolClass} animate-pulse`}>{effectElements.icon}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-wider">{outcome.title}</h2>
                    <div className="flex justify-center">
                        <div className="px-6 py-2 mt-2 mb-1 bg-white/20 backdrop-blur-sm rounded-full transform -rotate-1">
                            <span className="text-xl font-bold text-white">{outcome.message}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal.Body className="p-0">
                {/* Main Content */}
                <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-6">
                    {/* Battle Results Section */}
                    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-gray-200">
                        <div className="bg-gray-800 text-white py-3 px-4 text-center">
                            <h3 className="text-xl font-bold">BATTLE CHRONICLE</h3>
                        </div>
                        
                        <div className="p-6">
                            {/* Score Display with Epic Styling */}
                            <div className="flex flex-col md:flex-row justify-around items-center mb-6 gap-4">
                                <div className="w-full md:w-2/5">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-5 rounded-xl border border-blue-200 shadow-md transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-center">
                                            <h4 className="text-lg font-bold text-blue-600">{username}</h4>
                                            <div className="mt-2 mb-3 relative">
                                                <div className="absolute inset-0 bg-blue-500/10 rounded-full transform scale-110 animate-pulse"></div>
                                                <div className="relative z-10 text-6xl font-extrabold text-blue-700">
                                                    {match.player1 === username ? match.player1Score : match.player2Score}
                                                </div>
                                            </div>
                                            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">Your Score</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center my-2">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-red-500 flex items-center justify-center shadow-lg">
                                        <span className="font-extrabold text-white text-2xl">VS</span>
                                    </div>
                                    <div className="h-4"></div>
                                </div>
                                
                                <div className="w-full md:w-2/5">
                                    <div className="bg-gradient-to-br from-red-50 to-rose-100 p-5 rounded-xl border border-red-200 shadow-md transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-center">
                                            <h4 className="text-lg font-bold text-red-600">{getOpponentName()}</h4>
                                            <div className="mt-2 mb-3 relative">
                                                <div className="absolute inset-0 bg-red-500/10 rounded-full transform scale-110 animate-pulse"></div>
                                                <div className="relative z-10 text-6xl font-extrabold text-red-700">
                                                    {match.player1 === username ? match.player2Score : match.player1Score}
                                                </div>
                                            </div>
                                            <p className="text-sm text-red-600 font-medium uppercase tracking-wide">Opponent Score</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            
            <Modal.Footer className="border-t-0 bg-gradient-to-b from-gray-100 to-gray-200 p-6 flex justify-center">
                <button 
                    className="btn btn-dark"
                    onClick={handleReturnHome}
                >
                    <span>Return to Your Kingdom</span>
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default SSSMatchResultModal;