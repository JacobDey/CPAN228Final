import { useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function SSSCard({ data, compact = false }) {
    const [cardName] = useState(data.name);
    const [cardPower] = useState(data.power);
    const [cardDescription] = useState(data.description);
    const [cardColour] = useState(data.colour.toLowerCase());

    // Color mapping to Bootstrap variants and hex codes
    const colorStyles = {
        red: { border: 'danger', hex: '#dc3545' },
        blue: { border: 'primary', hex: '#0d6efd' },
        yellow: { border: 'warning', hex: '#ffc107' },
        purple: { border: 'secondary', hex: '#6f42c1' },
        green: { border: 'success', hex: '#198754' },
        orange: { border: 'warning', hex: '#fd7e14' },
        white: { border: 'light', hex: '#f8f9fa' }
    };

    const colorStyle = colorStyles[cardColour] || colorStyles.purple;

      // Compact mode for use in lists or deck builder
      if (compact) {
        return (
            <Card 
                border={colorStyle.border}
                style={{ 
                    width: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    borderWidth: '2px',
                    marginBottom: '10px',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    cursor: 'pointer'
                }}
                className="hover-card"
            >
                <Card.Body className="d-flex align-items-center p-2">
                    <div 
                        className="color-indicator me-2" 
                        style={{ 
                            width: '16px', 
                            height: '36px', 
                            backgroundColor: colorStyle.hex,
                            borderRadius: '4px'
                        }}
                    ></div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <Card.Title className="mb-0 h6">{cardName}</Card.Title>
                            <Badge 
                                bg={colorStyle.border} 
                                style={{ 
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {cardPower}
                            </Badge>
                        </div>
                        {cardDescription && (
                            <small className="text-muted text-truncate d-block">
                                {cardDescription}
                            </small>
                        )}
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div style={{ 
            margin: '5px', 
            width: '325px',
            flex: '0 0 auto'
        }}>
            <Link to={`/card/${data.id}`} style={{ textDecoration: 'none' }}>
                <Card 
                    border={colorStyle.border}
                    style={{ 
                        width: '100%',
                        height: '550px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        // backgroundColor: 'rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                        borderWidth: '3px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    className="hover-effect"
                >
                    {/* Placeholder Image */}
                    <img src={`http://localhost:8080/card/image/${data.id}`} alt={cardName} 
                    style={{
                        height: '180px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: `3px solid ${colorStyle.hex}`
                    }} />

                    <Card.Header 
                        style={{ 
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            fontWeight: 'bold',
                        }}
                    >
                        {cardName}
                    </Card.Header>
                    <Card.Body style={{ overflowY: 'auto', flex: '1' }}>
                        <Card.Text><strong>Power:</strong> <span style={{
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                color: colorStyle.hex == '#f8f9fa'? '#000': colorStyle.hex,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}>{cardPower}</span></Card.Text>
                        <Card.Text >
                            {cardDescription}
                        </Card.Text>
                        <Card.Text>
                            <strong>Colour:</strong> 
                            <span 
                                style={{
                                    display: 'inline-block',
                                    width: '15px',
                                    height: '15px',
                                    backgroundColor: colorStyle.hex,
                                    marginLeft: '5px',
                                    border: '1px solid #000',
                                    borderRadius: '50%'
                                }}
                                title={cardColour}
                            ></span>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Link>
        </div>
    )
}

export default SSSCard;