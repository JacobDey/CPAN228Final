import SSSNavbar from "../components/SSSNavbar.jsx";
import {Link} from "react-router";
import SSSCardContainer from "../components/SSSCardContainer.jsx";

function SSSCollection(){
    const cards = [
        {name: 'Dragon', power: 5, description: 'This is a dragon', colour: 'red'},
        {name: 'Siren', power: 4, description: 'Fish lady', colour: 'blue'},
        {name: 'Goblin', power: 3, description: 'You know what this is', colour: 'black'}
    ];

    return(
        <>
            <h1>This is the collection page for displaying decks and cards</h1>
            <div>
                <Link to="/decks">Decks</Link>
                <SSSCardContainer cards={cards}/>
                <Link to="/cards">Cards</Link>
            </div>
        </>
    )
}

export default SSSCollection;