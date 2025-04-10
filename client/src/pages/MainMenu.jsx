import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/SSSAuth";
import SSSCard from "../components/SSSCard";

function MainMenu() {
    const { isLogIn, username } = useAuth();
    const [featuredCards, setFeaturedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const SERVER_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchFeaturedCards = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${SERVER_URL}/card/random/5`);
                const data = await response.json();
                setFeaturedCards(data);
            } catch (error) {
                console.error("Error fetching featured cards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedCards();
    }, []);

    return (
        <div className="w-full">
            {/* Hero Section*/}
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col justify-center items-center text-white text-center overflow-hidden absolute top-0 left-0 right-0">
                {/* Animated card background*/}
                <div className="absolute inset-0 overflow-hidden">
                    {["bg-red-500", "bg-blue-500", "bg-yellow-400", "bg-purple-500", "bg-green-500",
                        "bg-orange-500", "bg-indigo-500", "bg-pink-400", "bg-teal-500"].map((color, index) => (
                            <div
                                key={index}
                                className={`absolute w-24 h-36 ${color} opacity-15 rounded-lg transform animate-float`}
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    transform: `rotate(${Math.random() * 40 - 20}deg)`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${5 + Math.random() * 5}s`,
                                    zIndex: 1
                                }}
                            />
                        ))}
                </div>

                <div className="z-10 px-6 w-full max-w-4xl mx-auto mt-16">
                    <h1 className="font-bangers text-6xl md:text-8xl lg:text-9xl tracking-wider text-blue-400 mb-8 animate-pulse-slow drop-shadow-lg">
                        Triple Siege
                    </h1>

                    <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 text-blue-100">
                        Build powerful decks, engage in strategic battles, and become the ultimate card master in this thrilling card game!
                    </p>

                    {isLogIn && (
                        <div className="mt-8 mb-8">
                            <span className="inline-block bg-blue-500 text-white text-xl px-6 py-3 rounded-full shadow-lg">
                                Welcome back, {username}!
                            </span>
                        </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {isLogIn ? (
                            <>
                                <Link
                                    to="/battle"
                                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl text-xl md:text-2xl"
                                >
                                    <span className="mr-3">⚔️</span> Battle Now
                                </Link>
                                <Link
                                    to="/collection"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl text-xl md:text-2xl"
                                >
                                    <span className="mr-3">🃏</span> My Collection
                                </Link>
                                <Link
                                    to="/booster"
                                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl text-xl md:text-2xl"
                                >
                                    <span className="mr-3">🎁</span> Open Packs
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl text-xl md:text-2xl"
                                >
                                    Register Now
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl text-xl md:text-2xl"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/cards"
                                    className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 md:py-5 md:px-10 rounded-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl text-xl md:text-2xl"
                                >
                                    Preview Cards
                                </Link>
                            </>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}

export default MainMenu;