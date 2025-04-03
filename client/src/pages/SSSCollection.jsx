import SSSNavbar from "../components/SSSNavbar.jsx";
import {Link} from "react-router";
import SSSCardContainer from "../components/SSSCardContainer.jsx";
import {useEffect, useState} from "react";
import _ from "lodash";

function SSSCollection(){
    const [cardData, setCardData] = useState([]);
    useEffect(() => {
        const fetchCards = async () => {
            const response = await fetch(`http://localhost:8080/card/cards`);
            const cards = await response.json();
            setCardData(_.sampleSize(cards, 5));
        }
        fetchCards();
    }, []);

    return(
        <>
            <h1>This is the collection page for displaying decks and cards</h1>
            <div>
                <Link to="/decks">Decks</Link>
                <SSSCardContainer cards={cardData}/>
                <Link to="/cards">Cards</Link>
            </div>
        </>
    )
}

export default SSSCollection;