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
                if (!isMounted) return;
                
                const response = await fetch(`${SERVER_URL}/card/random/1`);
                
                if (!response.ok) {
                    throw new Error(`Error fetching card: ${response.status}`);
                }
                
                const cardData = await response.json();
                
                if (isMounted) {
                    setCard(cardData[0]);
                }
            } catch (err) {
                console.error("Error fetching card:", err);
            }
        };
    
        fetchCard();
        
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
        <div className="container mx-auto py-4 px-2 sm:py-8 sm:px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Epic Header Section */}
                <div className="text-center mb-8 sm:mb-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-3xl transform -skew-y-1 z-0"></div>
                    <div className="relative z-10 py-6 sm:py-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">TRIPLE SIEGE</h1>
                        <div className="flex justify-center">
                            <div className="px-4 py-1 sm:px-6 sm:py-2 mt-1 sm:mt-2 mb-2 sm:mb-3 bg-yellow-500 rounded-full shadow-lg transform -rotate-2">
                                <span className="text-lg sm:text-2xl font-bold text-white">CONQUER • CONTROL • TRIUMPH</span>
                            </div>
                        </div>
                        <p className="text-base sm:text-xl text-gray-700 mt-4 sm:mt-8 max-w-3xl mx-auto font-medium">
                            Where strategy meets spectacle in an epic battle for arcane dominance. Not just another card game—a <span className="text-indigo-700 font-bold">battlefield of wits</span> where every decision reshapes destiny.
                        </p>
                    </div>
                </div>

                {/* Hero Battle Section */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl sm:shadow-2xl mb-8 sm:mb-12 overflow-hidden text-white">
                    <div className="p-4 sm:p-8 md:p-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">THE LEGENDARY CLASH</h2>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
                            <div>
                                <p className="text-base sm:text-xl leading-relaxed mb-4 sm:mb-6">
                                    In Triple Siege, dominance isn't just claimed—it's <span className="font-bold underline decoration-yellow-400">earned</span> through superior tactics and foresight.
                                </p>
                                <p className="text-sm sm:text-lg leading-relaxed">
                                    Master the ancient power of three mystical towers, command legendary creatures, and unleash devastating abilities in this high-stakes tactical showdown where every card placement could mean the difference between glorious victory and crushing defeat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Towers of Power Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-lg mb-8 sm:mb-12 overflow-hidden border-t-4 border-blue-600 sm:transform sm:hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-blue-600 py-3 sm:py-4 px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">THE TOWERS OF POWER</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
                            <div className="md:w-2/3">
                                <p className="text-base sm:text-lg text-gray-800 mb-4 sm:mb-6 font-medium">
                                    Three mystical towers stand as the focal points of your conquest. Each tower holds a <span className="font-bold text-blue-700">unique strategic value</span> that shifts with every battle, creating a constantly evolving strategic landscape.
                                </p>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-blue-700">Dynamic Value</h3>
                                            <p className="text-sm sm:text-gray-700">Each tower's worth ranges from 2-6 victory points, forcing players to adapt their strategy based on high-value targets.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-blue-700">Positional Mastery</h3>
                                            <p className="text-sm sm:text-gray-700">Where your cards are placed within each tower can trigger devastating combo effects. Tactical positioning is your hidden weapon.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-blue-700">Power Dominance</h3>
                                            <p className="text-sm sm:text-gray-700">Control is determined by raw power—but clever abilities can turn the tide in an instant.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/3 mt-4 sm:mt-0">
                                <div className="bg-white rounded-xl shadow-inner p-3 sm:p-4 h-full flex flex-col justify-center">
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="bg-gradient-to-r from-purple-200 to-purple-300 h-16 sm:h-24 rounded-lg flex items-center justify-center shadow-md">
                                            <span className="text-xl sm:text-2xl font-bold text-purple-800">6 POINTS</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-200 to-blue-300 h-14 sm:h-20 rounded-lg flex items-center justify-center shadow-md">
                                            <span className="text-xl sm:text-2xl font-bold text-blue-800">4 POINTS</span>
                                        </div>
                                        <div className="bg-gradient-to-r from-indigo-200 to-indigo-300 h-12 sm:h-16 rounded-lg flex items-center justify-center shadow-md">
                                            <span className="text-xl sm:text-2xl font-bold text-indigo-800">2 POINTS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Turn Structure Section*/}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-100 rounded-xl shadow-lg mb-8 sm:mb-12 overflow-hidden border-t-4 border-emerald-600 sm:transform sm:hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-emerald-600 py-3 sm:py-4 px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">THE TURN STRUCTURE</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <p className="text-base sm:text-lg text-gray-800 mb-4 sm:mb-6 font-medium">
                            Each turn in Triple Siege follows a <span className="font-bold text-emerald-700">precise three-phase structure</span> that creates the rhythm of battle. Mastering this flow is essential to victory.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                            <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-emerald-200 rounded-bl-full"></div>
                                <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2 sm:mb-3 relative z-10">1. Beginning Phase</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-sm sm:text-gray-700">The active player <span className="font-semibold">draws a card</span> from their deck.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-emerald-200 rounded-bl-full"></div>
                                <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2 sm:mb-3 relative z-10">2. Main Phase</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-sm sm:text-gray-700">Play <span className="font-semibold">up to 3 cards</span> in any order.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-sm sm:text-gray-700">Activate abilities and resolve effects.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-sm sm:text-gray-700">Pass to end the phase.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-emerald-200 rounded-bl-full"></div>
                                <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2 sm:mb-3 relative z-10">3. End Phase</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-start">
                                        <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold mr-2 flex-shrink-0">➤</span>
                                        <p className="text-sm sm:text-gray-700"><span className="font-semibold">Discard down to 7 cards</span> in hand.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-xl p-4 sm:p-6 shadow-md">
                            <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3 sm:mb-4 text-center">Strategic Considerations</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg">
                                    <h4 className="font-bold text-emerald-800">Card Management</h4>
                                    <p className="text-xs sm:text-sm text-gray-700">The 3-card limit per turn forces tough decisions about where to allocate your resources.</p>
                                </div>
                                <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg">
                                    <h4 className="font-bold text-emerald-800">Hand Size Control</h4>
                                    <p className="text-xs sm:text-sm text-gray-700">Discarding at the end phase prevents hoarding and encourages active gameplay.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Power Section */}
                <div className="bg-gradient-to-r from-red-50 to-rose-100 rounded-xl shadow-lg mb-8 sm:mb-12 overflow-hidden border-t-4 border-red-600 sm:transform sm:hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-red-600 py-3 sm:py-4 px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">UNLEASH YOUR ARSENAL</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                            <div className="md:w-3/5">
                                <p className="text-base sm:text-lg text-gray-800 mb-4 sm:mb-6 font-medium">
                                    Each card in your arsenal isn't just a number—it's a <span className="font-bold text-red-700">living extension of your tactical will</span>, with unique powers that can reshape the battlefield in dramatic ways.
                                </p>

                                <div className="bg-white/80 rounded-xl p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3 sm:mb-4">The Power Balance</h3>
                                    <ul className="space-y-2 sm:space-y-3">
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full text-white items-center justify-center font-bold mr-2 sm:mr-3 mt-0 sm:mt-1">!</span>
                                            <span className="text-sm sm:text-base">
                                                <span className="font-semibold">Cards with Low Power</span> grant special advantages that can turn the tide
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full text-white items-center justify-center font-bold mr-2 sm:mr-3 mt-0 sm:mt-1">!</span>
                                            <span className="text-sm sm:text-base"><span className="font-semibold">Cards with High Power</span> offer raw strength at a cost</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full text-white items-center justify-center font-bold mr-2 sm:mr-3 mt-0 sm:mt-1">!</span>
                                            <span className="text-sm sm:text-base">Finding the right balance between power and abilities is key to victory</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="md:w-2/5 flex justify-center items-center mt-4 sm:mt-0">
                                <div className="relative transform rotate-3 hover:rotate-0 transition-all duration-500 w-full max-w-xs">
                                    {card ?
                                        <div className="shadow-2xl rounded-xl">
                                            <SSSCard data={card} />
                                        </div>
                                        :
                                        <div className="w-full h-96 sm:w-64 sm:h-96 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
                                            <span className="text-gray-500">Loading card...</span>
                                        </div>
                                    }
                                    <div className="absolute -bottom-2 -right-2 bg-red-600 text-white font-bold rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transform rotate-12 text-xs sm:text-sm"
                                        onClick={handleClick}>
                                        <span>PLAY<br />NOW</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Identity Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-violet-100 rounded-xl shadow-lg mb-8 sm:mb-12 overflow-hidden border-t-4 border-indigo-600 sm:transform sm:hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-indigo-600 py-3 sm:py-4 px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">CHROMATIC MASTERY</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <p className="text-base sm:text-lg text-gray-800 mb-4 sm:mb-6 font-medium text-center">
                            The power of <span className="font-bold text-indigo-700">three primary colors</span> and their <span className="font-bold text-violet-700">hybrid combinations</span> define the essence of each card and unlock strategic synergies.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                            {/* Primary Colors */}
                            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                                <h3 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 sm:mb-6 text-center">Primary Colors</h3>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="bg-red-50 rounded-lg p-3 sm:p-4 border-l-4 border-red-600">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 mr-2 sm:mr-3 flex-shrink-0"></div>
                                            <h4 className="text-lg sm:text-xl font-bold text-red-700">Red</h4>
                                        </div>
                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-gray-700">
                                            <li>• <span className="font-semibold">Aggressive</span> - Hurts the opponent</li>
                                            <li>• Natural enemy of blue</li>
                                        </ul>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-600">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 mr-2 sm:mr-3 flex-shrink-0"></div>
                                            <h4 className="text-lg sm:text-xl font-bold text-blue-700">Blue</h4>
                                        </div>
                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-gray-700">
                                            <li>• <span className="font-semibold">Defensive</span> - Helps the player</li>
                                            <li>• Natural enemy of red</li>
                                        </ul>
                                    </div>

                                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500 mr-2 sm:mr-3 flex-shrink-0"></div>
                                            <h4 className="text-lg sm:text-xl font-bold text-yellow-600">Yellow</h4>
                                        </div>
                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-gray-700">
                                            <li>• <span className="font-semibold">Movement</span> - Symmetrical effects</li>
                                            <li>• Angels of justice and divine arbitrariness</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Hybrid Colors */}
                            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                                <h3 className="text-xl sm:text-2xl font-bold text-violet-700 mb-4 sm:mb-6 text-center">Hybrid Colors</h3>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border-l-4 border-purple-600">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-red-600 to-blue-600 mr-2 sm:mr-3 flex-shrink-0"></div>
                                            <h4 className="text-lg sm:text-xl font-bold text-purple-700">Purple (Red + Blue)</h4>
                                        </div>
                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-gray-700">
                                            <li>• <span className="font-semibold">Royalty</span> - Powerful and commanding</li>
                                            <li>• Yellow color hate and creature destruction</li>
                                            <li>• Counts as both Red and Blue for all effects</li>
                                        </ul>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-3 sm:p-4 border-l-4 border-green-600">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-yellow-500 mr-2 sm:mr-3 flex-shrink-0"></div>
                                            <h4 className="text-lg sm:text-xl font-bold text-green-700">Green (Blue + Yellow)</h4>
                                        </div>
                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-gray-700">
                                            <li>• <span className="font-semibold">Knowledge</span> - Card draw and wizardry</li>
                                            <li>• Scholarly magic and arcane wisdom</li>
                                            <li>• Counts as both Blue and Yellow for all effects</li>
                                        </ul>
                                    </div>

                                    <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border-l-4 border-orange-500">
                                        <div className="flex items-center mb-1 sm:mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-600 mr-2 sm:mr-3 flex-shrink-0"></div>
                                            <h4 className="text-lg sm:text-xl font-bold text-orange-600">Orange (Yellow + Red)</h4>
                                        </div>
                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-gray-700">
                                            <li>• <span className="font-semibold">Control</span> - Discard and creature movement</li>
                                            <li>• Forces opponents to discard cards</li>
                                            <li>• Electricity and natural energy</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 rounded-xl p-4 sm:p-6 shadow-md">
                            <h3 className="text-lg sm:text-xl font-bold text-indigo-700 mb-3 sm:mb-4 text-center">Color Strategy Guide</h3>
                            <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                                Mastering color combinations can lead to devastating synergies on the battlefield:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
                                    <h4 className="font-bold text-indigo-800 text-sm sm:text-base">Purple Dominance</h4>
                                    <p className="text-xs sm:text-sm text-gray-700">Combine royal might with targeted removal to control high-value towers.</p>
                                </div>
                                <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
                                    <h4 className="font-bold text-indigo-800 text-sm sm:text-base">Green Knowledge</h4>
                                    <p className="text-xs sm:text-sm text-gray-700">Draw into powerful combinations while maintaining defensive positions.</p>
                                </div>
                                <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
                                    <h4 className="font-bold text-indigo-800 text-sm sm:text-base">Orange Control</h4>
                                    <p className="text-xs sm:text-sm text-gray-700">Manipulate your opponent's board position while limiting their options.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Battle Flow Section */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl shadow-lg mb-8 sm:mb-12 overflow-hidden border-t-4 border-amber-500 sm:transform sm:hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-amber-500 py-3 sm:py-4 px-4 sm:px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">THE ART OF BATTLE</h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <p className="text-base sm:text-lg text-gray-800 mb-6 sm:mb-8 font-medium text-center">
                            A Triple Siege match is a <span className="font-bold text-amber-700">symphony of calculated moves</span> where patience and foresight determine the victor.
                        </p>

                        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                            <div className="md:w-1/2">
                                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-full">
                                    <h3 className="text-xl sm:text-2xl font-bold text-amber-700 mb-4 sm:mb-6 text-center">The Five-Turn Crucible</h3>
                                    <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                                        All glory and defeat unfolds across just five critical turns. This compressed timeline means <span className="font-semibold">every decision carries immense weight</span>—there are no throwaway moves in Triple Siege.
                                    </p>
                                    <div className="flex justify-center mb-3 sm:mb-4">
                                        <div className="inline-block bg-amber-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full border-2 border-amber-300">
                                            <span className="font-bold text-amber-800 text-sm sm:text-base">5 TURNS = PURE STRATEGY</span>
                                        </div>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700">
                                        When the dust settles after the fifth turn, tower control is calculated and the victor emerges. Strategic depth in a compact experience.
                                    </p>
                                </div>
                            </div>

                            <div className="md:w-1/2">
                                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 h-full">
                                    <h3 className="text-xl sm:text-2xl font-bold text-amber-700 mb-4 sm:mb-6 text-center">Three-Card Precision</h3>
                                    <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                                        Each turn you'll deploy up to <span className="font-semibold">three cards</span> across the battlefield. This limit forces tough choices:
                                    </p>
                                    <ul className="space-y-3 sm:space-y-4">
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 rounded-full text-white items-center justify-center font-bold mr-2 sm:mr-3 mt-0 sm:mt-1">?</span>
                                            <span className="text-sm sm:text-base">Reinforce a tower you're winning or counter your opponent's advances?</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 rounded-full text-white items-center justify-center font-bold mr-2 sm:mr-3 mt-0 sm:mt-1">?</span>
                                            <span className="text-sm sm:text-base">Deploy for immediate impact or set up future combos?</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="flex-shrink-0 inline-flex w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 rounded-full text-white items-center justify-center font-bold mr-2 sm:mr-3 mt-0 sm:mt-1">?</span>
                                            <span className="text-sm sm:text-base">Focus on one high-value tower or spread across all three?</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl sm:shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6">YOUR LEGEND AWAITS</h2>
                    <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Triple Siege isn't just played—it's mastered. Join the ranks of strategic masterminds who've discovered the perfect blend of calculation, foresight, and adaptability.
                    </p>
                    <div className="flex justify-center">
                        <button className="btn btn-dark text-white text-lg sm:text-xl font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full"
                            onClick={handleClick}>
                            BEGIN YOUR CONQUEST
                        </button>
                    </div>
                </div>

                {/* Master Tips Section */}
                <div className="mt-12 sm:mt-16 bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">MASTER STRATEGIST TIPS</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-indigo-500">
                            <h3 className="font-bold text-base sm:text-lg text-indigo-700">Tower Priority</h3>
                            <p className="text-xs sm:text-sm text-gray-700">The 6-point tower is worth three times the 2-point tower. Allocate resources accordingly.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                            <h3 className="font-bold text-base sm:text-lg text-red-700">Power Economy</h3>
                            <p className="text-xs sm:text-sm text-gray-700">Winning a tower by 1 power is as good as winning by 10. Don't overcommit.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                            <h3 className="font-bold text-base sm:text-lg text-yellow-600">Position Matters</h3>
                            <p className="text-xs sm:text-sm text-gray-700">Cards at the base of towers often trigger different effects than those at the top.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                            <h3 className="font-bold text-base sm:text-lg text-blue-700">Great Power Comes Great Responsibility</h3>
                            <p className="text-xs sm:text-sm text-gray-700">Card with high power come with ability that could hurt the owner.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SSSHowToPlay;