import SSSNavbar from "../components/SSSNavbar.jsx";
import {Link} from "react-router";

function SSSCollection(){
    return(
        <>
            <SSSNavbar />
            <h1>This is the collection page for displaying decks and cards</h1>
            <div>
                <Link to="/decks">Decks</Link>
                <Link to="/cards">Cards</Link>
            </div>
        </>
    )
}

export default SSSCollection;