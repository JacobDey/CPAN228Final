import React from 'react';
import { useEffect, useState } from "react";
import SSSCard from '../components/SSSCard';

function SSSHowToPlay() {

    const [card, setCard] = useState(null);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/card/random/1`);
                
                if (!response.ok) {
                    throw new Error(`Error fetching card: ${response.status}`);
                }

                const cardData = await response.json();
                console.log(cardData[0]);
                setCard(cardData[0]);
            } catch (err) {
                console.error("Error fetching card:", err);
            }
        };

        fetchCard();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-800">How to Play: Triple Siege</h1>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-yellow-500"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-yellow-600 text-xl font-semibold">THE BATTLEFIELD OF WITS AND POWER</span>
                        </div>
                    </div>
                    <p className="text-lg text-gray-700 mb-8 bg-white">
                        In this strategic tower conquest game, victory belongs to those who can outwit their opponents through clever card placement and tactical ability timing. Will you dominate the battlefield with raw power, cunning abilities, or a perfect blend of both?
                    </p>
                </div>

                {/* Objective Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-yellow-500 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">OBJECTIVE</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-800 mb-6">
                            You and your opponent engage in a magical skirmish across three mysterious towers of varying value. Through five turns of calculated card plays, you'll aim to control these towers by overwhelming them with your cards' power. When the dust settles, control of the towers grants you victory points—and the player with the most points claims victory.
                        </p>
                        {/* <div className="flex justify-center my-6">
              <div className="bg-gray-200 rounded-lg w-full max-w-lg h-48 flex items-center justify-center">
                <span className="text-gray-500">Tower battlefield illustration</span>
              </div>
            </div> */}
                    </div>
                </div>

                {/* Towers Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">THE TOWERS OF POWER</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">Tower Value</h3>
                            <p className="text-gray-800">Each of the three towers has a randomly assigned victory point value (2-6) at the start of each game. Higher-valued towers become natural focal points for the fiercest competitions.</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">Tower Control</h3>
                            <p className="text-gray-800">The player whose cards have the highest combined power value on a tower controls it. Strategic card placement can shift tower control multiple times during a match.</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">Card Positioning</h3>
                            <p className="text-gray-800">Some special abilities care about card position! The card closest to the tower base is the "1st card," the next one up is the "2nd card," and so on—positioning can be crucial for certain powerful effects.</p>
                        </div>
                    </div>
                </div>

                {/* Battle Flow Section */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-amber-500 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">BATTLE FLOW</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-amber-700 mb-3">Game Setup</h3>
                            <ol className="list-decimal pl-5 text-gray-800 space-y-2">
                                <li>Shuffle your 20-card deck</li>
                                <li>Random tower values (2-6) are assigned</li>
                                <li>Each player draws their starting hand</li>
                            </ol>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-amber-700 mb-3">Turn Sequence</h3>
                            <p className="text-gray-800 mb-4">Each turn unfolds in three distinct phases:</p>

                            <div className="p-4 border-2 border-gray-300 rounded-lg bg-white mb-4">
                                <h4 className="font-bold text-gray-800">1. Beginning Phase</h4>
                                <p className="text-gray-700">Draw one card from your deck</p>
                            </div>

                            <div className="p-4 border-2 border-gray-300 rounded-lg bg-white mb-4">
                                <h4 className="font-bold text-gray-800">2. Main Phase</h4>
                                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    <li>Play up to 3 cards on any towers</li>
                                    <li>Each card's abilities may trigger immediately or create ongoing effects</li>
                                    <li>Once satisfied with your plays, pass the turn</li>
                                </ul>
                            </div>

                            <div className="p-4 border-2 border-gray-300 rounded-lg bg-white">
                                <h4 className="font-bold text-gray-800">3. End Phase</h4>
                                <p className="text-gray-700">If you have more than 7 cards in hand, discard down to 7</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-amber-700 mb-3">Game End</h3>
                            <p className="text-gray-800 mb-2">After both players have completed 5 turns:</p>
                            <ul className="list-disc pl-5 text-gray-800 space-y-2">
                                <li>Calculate the total power for each player on each tower</li>
                                <li>Award victory points from each tower to the player who controls it</li>
                                <li>The player with the most total victory points wins!</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="bg-gradient-to-r from-red-50 to-rose-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-red-600 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">THE CARDS OF CONQUEST</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-3/5">
                                <h3 className="text-xl font-semibold text-red-700 mb-4">Card Anatomy</h3>
                                <ul className="space-y-4">
                                    <li>
                                        <span className="font-bold text-red-800">Name:</span> The identifier below the picture
                                    </li>
                                    <li>
                                        <span className="font-bold text-red-800">Power:</span> The numeric value that determines tower control
                                        <ul className="ml-6 mt-2 space-y-1 list-disc text-gray-700">
                                            <li>Cards with power 3 have special advantages</li>
                                            <li>Cards with power 4 come with drawbacks</li>
                                            <li>The average (par) power is 3.5</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="font-bold text-red-800">Ability:</span> Special effects that trigger when played or persist while on a tower
                                    </li>
                                    <li>
                                        <span className="font-bold text-red-800">Color:</span> Red, Blue, or Yellow frame (with hybrid colors possible)
                                    </li>
                                </ul>
                            </div>
                            <div className="md:w-2/5 flex justify-center">
                                <div className="bg-gray-200 rounded-lg w-full max-w-xs h-80 flex items-center justify-center">
                                {card ? <SSSCard data={card} gameplay={true}/> : <p>Loading card...</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Spectrum Section */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-purple-600 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">THE COLOR SPECTRUM</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-purple-700 mb-4">Primary Colors</h3>

                                <div className="mb-4 p-4 border-2 border-red-500 rounded-lg bg-red-50">
                                    <h4 className="text-lg font-semibold text-red-700">Red 🔴</h4>
                                    <p className="text-gray-800">Aggressive cards that harm your opponent. Features red and black creatures. Natural enemy of Blue.</p>
                                </div>

                                <div className="mb-4 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                                    <h4 className="text-lg font-semibold text-blue-700">Blue 🔵</h4>
                                    <p className="text-gray-800">Defensive cards that bolster your own position. Features blue and green creatures. Natural enemy of Red.</p>
                                </div>

                                <div className="mb-4 p-4 border-2 border-yellow-500 rounded-lg bg-yellow-50">
                                    <h4 className="text-lg font-semibold text-yellow-600">Yellow 🟡</h4>
                                    <p className="text-gray-800">Movement-focused cards with symmetrical effects. Features divine arbiters and angels of justice.</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-purple-700 mb-4">Hybrid Colors</h3>

                                <div className="mb-4 p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
                                    <h4 className="text-lg font-semibold text-purple-700">Purple 🟣 (Red + Blue)</h4>
                                    <p className="text-gray-800">Royalty-themed cards with creature destruction abilities. Counters Yellow strategies.</p>
                                </div>

                                <div className="mb-4 p-4 border-2 border-green-500 rounded-lg bg-green-50">
                                    <h4 className="text-lg font-semibold text-green-700">Green 🟢 (Blue + Yellow)</h4>
                                    <p className="text-gray-800">Card draw specialists featuring wise wizards and magical scholars.</p>
                                </div>

                                <div className="mb-4 p-4 border-2 border-orange-500 rounded-lg bg-orange-50">
                                    <h4 className="text-lg font-semibold text-orange-600">Orange 🟠 (Yellow + Red)</h4>
                                    <p className="text-gray-800">Control-oriented cards that move opponents' creatures and disrupt their plans.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deck Building Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-green-600 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">BUILDING YOUR ARSENAL</h2>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-green-700 mb-4">Deck Construction Rules</h3>
                        <ul className="list-disc pl-5 text-gray-800 space-y-2">
                            <li>Each deck must contain exactly 20 cards</li>
                            <li>You may include up to 2 copies of any single card</li>
                        </ul>
                    </div>
                </div>

                

                {/* Strategic Tips Section */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gray-700 py-3 px-6">
                        <h2 className="text-2xl font-bold text-white">STRATEGIC TIPS</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">🏆</span>
                                <div>
                                    <p className="font-bold text-gray-800">Tower Priority</p>
                                    <p className="text-gray-700">Focus your strongest cards on high-value towers</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <span className="text-2xl mr-3">⏱️</span>
                                <div>
                                    <p className="font-bold text-gray-800">Ability Timing</p>
                                    <p className="text-gray-700">Some effects are more powerful early, others shine late-game</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <span className="text-2xl mr-3">💰</span>
                                <div>
                                    <p className="font-bold text-gray-800">Card Conservation</p>
                                    <p className="text-gray-700">Don't overcommit to a single tower—you might need those cards elsewhere!</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <span className="text-2xl mr-3">🎯</span>
                                <div>
                                    <p className="font-bold text-gray-800">Position Matters</p>
                                    <p className="text-gray-700">Remember that card order on towers can affect certain abilities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Call to Action */}
                <div className="text-center p-6 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-500 rounded-xl">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-2">Are you ready to claim the towers as your own?</h3>
                    <p className="text-lg text-gray-800">The battlefield awaits!</p>
                </div>
            </div>
        </div>
    );
}

export default SSSHowToPlay;