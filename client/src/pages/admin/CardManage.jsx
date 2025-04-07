import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import CardEditForm from './CardEditForm';

const CardManage = () => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const SERVER_URL = 'http://localhost:8080';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${SERVER_URL}/admin/test`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } catch (err) {
                alert("You don't have permission");
                navigate('/');
            }
        };

        checkAuth();
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/card/allCards`);
            setCards(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch cards');
            setLoading(false);
        }
    };

    const handleEdit = (card) => {
        setSelectedCard(card);
    };

    const handleDelete = async (cardId) => {
        try {
            console.log(`Attempting to delete card with ID: ${cardId}`);
            const response = await axios.delete(`${SERVER_URL}/admin/deleteCard/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Delete response:', response.data);
            fetchCards(); // Refresh the cards list
            alert('Card deleted successfully');
        } catch (err) {
            console.error('Delete error:', err.response ? err.response.data : err.message);
            alert(`Failed to delete card: ${err.response ? err.response.data : err.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Card Management</h1>

            {selectedCard ? (
                <CardEditForm
                    card={selectedCard}
                    onCancel={() => setSelectedCard(null)}
                    onSave={() => {
                        setSelectedCard(null);
                        fetchCards();
                    }}
                />
            ) : (
                <div>
                    <button
                        onClick={() => setSelectedCard({
                            name: '',
                            description: '',
                            colour: '',
                            power: 0,
                            image: '',
                            imageData: null,
                            imageType: ''
                        })}
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                    >
                        Add New Card
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(card => (
                            <div key={card.id} className="border rounded-lg p-4 shadow">

                                <img
                                    src={`http://localhost:8080/card/image/${card.id}`}
                                    alt={card.name}
                                    height={'200px'}
                                />

                                <h3 className="font-bold text-lg">{card.name}</h3>
                                <p className="text-gray-600">{card.description}</p>
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm">Power: {card.power}</span>
                                    <span className="text-sm">Color: {card.colour}</span>
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        onClick={() => handleEdit(card)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardManage;