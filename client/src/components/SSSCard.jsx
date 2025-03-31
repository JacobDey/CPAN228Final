import {useState} from "react";
import {Card} from "react-bootstrap";

function SSSCard({index, data}){
    const [cardName, setCardName] = useState(data.cardName);
    const [cardPower, setCardPower] = useState(data.cardPower);
    const [cardDescription, setCardDescription] = useState(data.cardDescription);
    const [cardColour, setCardColour] = useState(data.cardColour);

    return(
        <Card bg='primary' text='light'>
            <Card.Header>
                {cardName}
            </Card.Header>
            <Card.Body>
                <Card.Text>Power: {cardPower}</Card.Text>
                <Card.Text>{cardDescription}</Card.Text>
                <Card.Text>Colour: {cardColour}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default SSSCard;