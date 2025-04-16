import React from 'react';
import { useEffect, useState } from "react";
import { useAuth } from "../components/SSSAuth";
import SSSCard from '../components/SSSCard';
import { useNavigate } from "react-router-dom";

function SSSHowToPlay() {
    const [card, setCard] = useState(null);
    const { isLogIn } = useAuth();
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    useEffect(() => {
        let isMounted = true;
        
        const fetchCard = async () => {
            try {
                // Only proceed if the component is still mounted
                if (!isMounted) return;
                
                const response = await fetch(`${SERVER_URL}/card/random/1`);
                
                if (!response.ok) {
                    throw new Error(`Error fetching card: ${response.status}`);
                }
                
                const cardData = await response.json();
                
                // Check if component is still mounted before updating state
                if (isMounted) {
                    setCard(cardData[0]);
                }
            } catch (err) {
                console.error("Error fetching card:", err);
            }
        };
    
        fetchCard();
        
        // Cleanup function to handle component unmounting
        return () => {
            isMounted = false;
        };
    }, []);

    const handleClick = () => {
        if (isLogIn) {
            navigate('/battle');
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Epic Header Section */}
                <div className="text-center mb-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-3xl transform -skew-y-1 z-0"></div>
                    <div className="relative z-10 py-8">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">TRIPLE SIEGE</h1>
                        <div className="flex justify-center">
                            <div className="px-6 py-2 mt-2 mb-3 bg-yellow-500 rounded-full shadow-lg transform -rotate-2">
                                <span className="text-2xl font-bold text-white">CONQUER • CONTROL • TRIUMPH</span>
                            </div>
                        </div>
                        <p className="text-xl text-gray-700 mt-8 max-w-3xl mx-auto font-medium">
                            Where strategy meets spectacle in an epic battle for arcane dominance. Not just another card game—a <span className="text-indigo-700 font-bold">battlefield of wits</span> where every decision reshapes destiny.
                        </p>
                    </div>
                </div>

                {/* Hero Battle Section */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-2xl mb-12 overflow-hidden text-white">
                    <div className="p-8 md:p-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">THE LEGENDARY CLASH</h2>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className>
                                <p className="text-xl leading-relaxed mb-6">
                                    In Triple Siege, dominance isn't just claimed—it's <span className="font-bold underline decoration-yellow-400">earned</span> through superior tactics and foresight.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Master the ancient power of three mystical towers, command legendary creatures, and unleash devastating abilities in this high-stakes tactical showdown where every card placement could mean the difference between glorious victory and crushing defeat.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Towers of Power Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-lg mb-12 overflow-hidden border-t-4 border-blue-600 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-blue-600 py-4 px-6">
                        <h2 className="text-2xl font-bold text-white">THE TOWERS OF POWER</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-2/3">
                                <p className="text-lg text-gray-800 mb-6 font-medium">
                                    Three mystical towers stand as the focal points of your conquest. Each tower holds a <span className="font-bold text-blue-700">unique strategic value</span> that shifts with every battle, creating a constantly evolving strategic landscape.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-700">Dynamic Value</h3>
                                            <p className="text-gray-700">Each tower's worth ranges from 2-6 victory points, forcing players to adapt their strategy based on high-value targets.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-700">Positional Mastery</h3>
                                            <p className="text-gray-700">Where your cards are placed within each tower can trigger devastating combo effects. Tactical positioning is your hidden weapon.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-700">Power Dominance</h3>
                                            <p className="text-gray-700">Control is determined by raw power—but clever abilities can turn the tide in an instant.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/3">
                                <div className="bg-white rounded-xl shadow-inner p-4 h-full flex flex-col justify-center">
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-purple-200 to-purple-300 h-24 rounded-lg flex items-center justify-center shadow-md">
                                            <span className="text-2xl font-bold text-purple-800">6 POINTS</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-200 to-blue-300 h-20 rounded-lg flex items-center justify-center shadow-md">
                                            <span className="text-2xl font-bold text-blue-800">4 POINTS</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-indigo-200 to-indigo-300 h-16 rounded-lg flex items-center justify-center shadow-md">
                                            <span className="text-2xl font-bold text-indigo-800">2 POINTS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Turn Structure Section*/}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-100 rounded-xl shadow-lg mb-12 overflow-hidden border-t-4 border-emerald-600 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-emerald-600 py-4 px-6">
                        <h2 className="text-2xl font-bold text-white">THE TURN STRUCTURE</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-lg text-gray-800 mb-6 font-medium">
                            Each turn in Triple Siege follows a <span className="font-bold text-emerald-700">precise three-phase structure</span> that creates the rhythm of battle. Mastering this flow is essential to victory.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white rounded-xl shadow-md p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200 rounded-bl-full"></div>
                                <h3 className="text-xl font-bold text-emerald-700 mb-3 relative z-10">1. Beginning Phase</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-gray-700">The active player <span className="font-semibold">draws a card</span> from their deck.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200 rounded-bl-full"></div>
                                <h3 className="text-xl font-bold text-emerald-700 mb-3 relative z-10">2. Main Phase</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-gray-700">Play <span className="font-semibold">up to 3 cards</span> in any order.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-gray-700">Activate abilities and resolve effects.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-gray-700">Pass to end the phase.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200 rounded-bl-full"></div>
                                <h3 className="text-xl font-bold text-emerald-700 mb-3 relative z-10">3. End Phase</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start mt-10">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-gray-700"><span className="font-semibold">Discard down to 7 cards</span> in hand.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-xl p-6 shadow-md">
                            <h3 className="text-xl font-bold text-emerald-700 mb-4 text-center">Strategic Considerations</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-emerald-50 p-4 rounded-lg">
                                    <h4 className="font-bold text-emerald-800">Card Management</h4>
                                    <p className="text-gray-700">The 3-card limit per turn forces tough decisions about where to allocate your resources.</p>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-lg">
                                    <h4 className="font-bold text-emerald-800">Hand Size Control</h4>
                                    <p className="text-gray-700">Discarding at the end phase prevents hoarding and encourages active gameplay.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Power Section */}
                <div className="bg-gradient-to-r from-red-50 to-rose-100 rounded-xl shadow-lg mb-12 overflow-hidden border-t-4 border-red-600 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-red-600 py-4 px-6">
                        <h2 className="text-2xl font-bold text-white">UNLEASH YOUR ARSENAL</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-3/5">
                                <p className="text-lg text-gray-800 mb-6 font-medium">
                                    Each card in your arsenal isn't just a number—it's a <span className="font-bold text-red-700">living extension of your tactical will</span>, with unique powers that can reshape the battlefield in dramatic ways.
                                </p>

                                <div className="bg-white/80 rounded-xl p-6 shadow-md mb-6">
                                    <h3 className="text-xl font-bold text-red-700 mb-4">The Power Balance</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-8 h-8 bg-yellow-500 rounded-full text-white items-center justify-center font-bold mr-3 mt-1">!</span>
                                            <span>
                                                <span className="font-semibold">Cards with Low Power</span> grant special advantages that can turn the tide
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-8 h-8 bg-red-500 rounded-full text-white items-center justify-center font-bold mr-3 mt-1">!</span>
                                            <span><span className="font-semibold">Cards with High Power</span> offer raw strength at a cost</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-8 h-8 bg-purple-500 rounded-full text-white items-center justify-center font-bold mr-3 mt-1">!</span>
                                            <span>Finding the right balance between power and abilities is key to victory</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="md:w-2/5 flex justify-center items-center">
                                <div className="relative transform rotate-3 hover:rotate-0 transition-all duration-500">
                                    {card ?
                                        <div className="shadow-2xl rounded-xl">
                                            <SSSCard data={card} />
                                        </div>
                                        :
                                        <div className="w-64 h-96 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
                                            <span className="text-gray-500">Loading card...</span>
                                        </div>
                                    }
                                    <div className="absolute -bottom-2 -right-2 bg-red-600 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center transform rotate-12"
                                        onClick={handleClick}>
                                        <span>PLAY<br />NOW</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Identity Section - UPDATED */}
                <div className="bg-gradient-to-r from-indigo-50 to-violet-100 rounded-xl shadow-lg mb-12 overflow-hidden border-t-4 border-indigo-600 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-indigo-600 py-4 px-6">
                        <h2 className="text-2xl font-bold text-white">CHROMATIC MASTERY</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-lg text-gray-800 mb-6 font-medium text-center">
                            The power of <span className="font-bold text-indigo-700">three primary colors</span> and their <span className="font-bold text-violet-700">hybrid combinations</span> define the essence of each card and unlock strategic synergies.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Primary Colors */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Primary Colors</h3>

                                <div className="space-y-6">
                                    <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-red-600 mr-3 flex-shrink-0"></div>
                                            <h4 className="text-xl font-bold text-red-700">Red</h4>
                                        </div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• <span className="font-semibold">Aggressive</span> - Hurts the opponent</li>
                                            <li>• Natural enemy of blue</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-600 mr-3 flex-shrink-0"></div>
                                            <h4 className="text-xl font-bold text-blue-700">Blue</h4>
                                        </div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• <span className="font-semibold">Defensive</span> - Helps the player</li>
                                            <li>• Natural enemy of red</li>
                                        </ul>
                                    </div>

                                    <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500 mr-3 flex-shrink-0"></div>
                                            <h4 className="text-xl font-bold text-yellow-600">Yellow</h4>
                                        </div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• <span className="font-semibold">Movement</span> - Symmetrical effects</li>
                                            <li>• Angels of justice and divine arbitrariness</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Hybrid Colors */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-2xl font-bold text-violet-700 mb-6 text-center">Hybrid Colors</h3>

                                <div className="space-y-6">
                                    <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-blue-600 mr-3 flex-shrink-0"></div>
                                            <h4 className="text-xl font-bold text-purple-700">Purple (Red + Blue)</h4>
                                        </div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• <span className="font-semibold">Royalty</span> - Powerful and commanding</li>
                                            <li>• Yellow color hate and creature destruction</li>
                                            <li>• Counts as both Red and Blue for all effects</li>
                                        </ul>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-yellow-500 mr-3 flex-shrink-0"></div>
                                            <h4 className="text-xl font-bold text-green-700">Green (Blue + Yellow)</h4>
                                        </div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• <span className="font-semibold">Knowledge</span> - Card draw and wizardry</li>
                                            <li>• Scholarly magic and arcane wisdom</li>
                                            <li>• Counts as both Blue and Yellow for all effects</li>
                                        </ul>
                                    </div>

                                    <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-600 mr-3 flex-shrink-0"></div>
                                            <h4 className="text-xl font-bold text-orange-600">Orange (Yellow + Red)</h4>
                                        </div>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• <span className="font-semibold">Control</span> - Discard and creature movement</li>
                                            <li>• Forces opponents to discard cards</li>
                                            <li>• Electricity and natural energy</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-xl p-6 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-700 mb-4 text-center">Color Strategy Guide</h3>
                            <p className="text-gray-700 mb-4">
                                Mastering color combinations can lead to devastating synergies on the battlefield:
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                    <h4 className="font-bold text-indigo-800">Purple Dominance</h4>
                                    <p className="text-gray-700">Combine royal might with targeted removal to control high-value towers.</p>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                    <h4 className="font-bold text-indigo-800">Green Knowledge</h4>
                                    <p className="text-gray-700">Draw into powerful combinations while maintaining defensive positions.</p>
                                </div>
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                    <h4 className="font-bold text-indigo-800">Orange Control</h4>
                                    <p className="text-gray-700">Manipulate your opponent's board position while limiting their options.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Battle Flow Section */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl shadow-lg mb-12 overflow-hidden border-t-4 border-amber-500 transform hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-amber-500 py-4 px-6">
                        <h2 className="text-2xl font-bold text-white">THE ART OF BATTLE</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-lg text-gray-800 mb-8 font-medium text-center">
                            A Triple Siege match is a <span className="font-bold text-amber-700">symphony of calculated moves</span> where patience and foresight determine the victor.
                        </p>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2">
                                <div className="bg-white rounded-xl shadow-md p-6 h-full">
                                    <h3 className="text-2xl font-bold text-amber-700 mb-6 text-center">The Five-Turn Crucible</h3>
                                    <p className="text-gray-700 mb-6">
                                        All glory and defeat unfolds across just five critical turns. This compressed timeline means <span className="font-semibold">every decision carries immense weight</span>—there are no throwaway moves in Triple Siege.
                                    </p>
                                    <div className="flex justify-center mb-4">
                                        <div className="inline-block bg-amber-100 px-4 py-2 rounded-full border-2 border-amber-300">
                                            <span className="font-bold text-amber-800">5 TURNS = PURE STRATEGY</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">
                                        When the dust settles after the fifth turn, tower control is calculated and the victor emerges. Strategic depth in a compact experience.
                                    </p>
                                </div>
                            </div>

                            <div className="md:w-1/2">
                                <div className="bg-white rounded-xl shadow-md p-6 h-full">
                                    <h3 className="text-2xl font-bold text-amber-700 mb-6 text-center">Three-Card Precision</h3>
                                    <p className="text-gray-700 mb-6">
                                        Each turn you'll deploy up to <span className="font-semibold">three cards</span> across the battlefield. This limit forces tough choices:
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-8 h-8 bg-amber-500 rounded-full text-white items-center justify-center font-bold mr-3 mt-1">?</span>
                                            <span>Reinforce a tower you're winning or counter your opponent's advances?</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-8 h-8 bg-amber-500 rounded-full text-white items-center justify-center font-bold mr-3 mt-1">?</span>
                                            <span>Deploy for immediate impact or set up future combos?</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-8 h-8 bg-amber-500 rounded-full text-white items-center justify-center font-bold mr-3 mt-1">?</span>
                                            <span>Focus on one high-value tower or spread across all three?</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center p-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">YOUR LEGEND AWAITS</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Triple Siege isn't just played—it's mastered. Join the ranks of strategic masterminds who've discovered the perfect blend of calculation, foresight, and adaptability.
                    </p>
                    <div className="flex justify-center">
                        <button className="btn btn-dark text-white text-xl font-bold py-4 px-8 rounded-full"
                            onClick={handleClick}>
                            BEGIN YOUR CONQUEST
                        </button>
                    </div>
                </div>

                {/* Master Tips Section */}
                <div className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">MASTER STRATEGIST TIPS</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                            <h3 className="font-bold text-lg text-indigo-700">Tower Priority</h3>
                            <p className="text-gray-700">The 6-point tower is worth three times the 2-point tower. Allocate resources accordingly.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                            <h3 className="font-bold text-lg text-red-700">Power Economy</h3>
                            <p className="text-gray-700">Winning a tower by 1 power is as good as winning by 10. Don't overcommit.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500">
                            <h3 className="font-bold text-lg text-yellow-600">Position Matters</h3>
                            <p className="text-gray-700">Cards at the base of towers often trigger different effects than those at the top.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <h3 className="font-bold text-lg text-blue-700">Great Power Comes Great Responsibility</h3>
                            <p className="text-gray-700">Card with high power come with ability that could hurt the owner.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SSSHowToPlay;
