import SSSNavbar from "../components/SSSNavbar.jsx";
import {useEffect, useState} from "react";
import SSSCardContainer from "../components/SSSCardContainer.jsx";

function SSSCards(){
    const [cardData, setCardData] = useState([]);
    useEffect(() => {
        const fetchCards = async () => {
            const response = await fetch(`http://localhost:8080/card/cards`);
            const cards = await response.json();
            setCardData(cards);
        }
        fetchCards();
    }, []);

    useEffect(() => {

        console.log(cardData);
    }, [cardData]);

    return(
        <>
            <h1>This page is for viewing cards</h1>
            <SSSCardContainer cards={cardData} />
        </>
    )
}

export default SSSCards;