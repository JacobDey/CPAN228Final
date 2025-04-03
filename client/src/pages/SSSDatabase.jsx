import {useEffect, useState} from "react";
import SSSCardContainer from "../components/SSSCardContainer.jsx";

function SSSDatabase(){
    const [cardData, setCardData] = useState([]);
    useEffect(() => {
        const fetchCards = async () => {
            const response = await fetch(`http://localhost:8080/card/cards`);
            const cards = await response.json();
            setCardData(cards);
        }
        fetchCards();
    }, []);

    return(
        <>
            <h1>This page is for viewing cards</h1>
            <SSSCardContainer cards={cardData} />
        </>
    )
}

export default SSSDatabase;