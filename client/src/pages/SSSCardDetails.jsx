import { useParams } from "react-router";
import SSSNavbar from "../components/SSSNavbar.jsx";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

function SSSCardDetails() {
    const { id } = useParams();
    const [card, setCard] = useState(null);

    const colorStyles = {
        red: { border: 'danger', hex: '#dc3545' },
        blue: { border: 'primary', hex: '#0d6efd' },
        yellow: { border: 'warning', hex: '#ffc107' },
        purple: { border: 'secondary', hex: '#6f42c1' },
        green: { border: 'success', hex: '#198754' },
        orange: { border: 'warning', hex: '#fd7e14' },
        white: { border: 'light', hex: '#f8f9fa' }
    };

    useEffect(() => {
        const fetchCard = async () => {
            const response = await fetch(`http://localhost:8080/card/id/${id}`);
            const cardData = await response.json();
            setCard(cardData);
        }
        fetchCard();
    }, [id]);

    if (!card) return <div>Loading...</div>;

    const cardColour = card.colour.toLowerCase();
    const colorStyle = colorStyles[cardColour] || colorStyles.purple;

    return (
        <>
            <SSSNavbar />
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '40px',
                minHeight: '80vh'
            }}>
                <Card 
                    border={colorStyle.border}
                    style={{ 
                        width: '400px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        borderWidth: '3px'
                    }}
                >
                    {/* Placeholder Image */}
                    <div style={{
                        height: '250px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: `3px solid ${colorStyle.hex}`
                    }}>
     
                    </div>

                    <Card.Header 
                        style={{ 
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            borderBottom: `3px solid ${colorStyle.hex}`,
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            textAlign: 'center'
                        }}
                    >
                        {card.name}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text><strong>Power:</strong> {card.power}</Card.Text>
                        <Card.Text><strong>Description:</strong> {card.description}</Card.Text>
                        <Card.Text>
                            <strong>Colour:</strong> 
                            <span 
                                style={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: colorStyle.hex,
                                    marginLeft: '10px',
                                    border: '1px solid #000',
                                    verticalAlign: 'middle',
                                    borderRadius: '50%'
                                }}
                                title={cardColour}
                            ></span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default SSSCardDetails;