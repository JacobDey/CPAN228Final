import {useState} from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router";

// This is just placeholder code to give an idea it, the end result will fetch card art from the database
function SSSCard({index, data}){
    const [cardName] = useState(data.name);
    const [cardPower] = useState(data.power);
    const [cardDescription] = useState(data.description);
    const [cardColour] = useState(data.colour);

    // if ((cardColour === 'white') or (cardColour === 'yellow')){


    const cardStyle = {
        width: '200px',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        backgroundColor: cardColour,
        color: 'black',
        // color: cardColour === 'white' ? 'black !important' : 'white',
        position: 'relative'
    };

    const powerStyle = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    };

    return(
        <Link to={`/card/${index}`}>
            <Card style={cardStyle}>
                <Card.Header>
                    {cardName}
                </Card.Header>
                <Card.Body>
                    <Card.Text>{cardDescription}</Card.Text>
                    {/* <Card.Text>Colour: {cardColour}</Card.Text> */}
                </Card.Body>
                <div style={powerStyle}>{cardPower}</div>
            </Card>
        </Link>
    )
}

export default SSSCard;