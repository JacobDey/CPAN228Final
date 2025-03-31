import SSSNavbar from "../components/SSSNavbar.jsx";
import {Link} from "react-router";
import SSSCardContainer from "../components/SSSCardContainer.jsx";

function SSSCollection(){
    return(
        <>
            <SSSNavbar />
            <h1>This is the collection page for displaying decks and cards</h1>
            <div>
                <Link to="/decks">Decks</Link>
                <SSSCardContainer />
                <Link to="/cards">Cards</Link>
            </div>
        </>
    )
}

export default SSSCollection;