import SSSNavbar from "../components/SSSNavbar.jsx";
import SSSMatchBrowser from "../components/SSSMatchBrowser.jsx";
import { useNavigate } from 'react-router-dom';

function SSSBattle(){
    const navigate = useNavigate();

    const handleComingSoon = () => {
        alert("Coming soon!");
    };

    return(
        <>
            <SSSNavbar />
            <h1>Battle!</h1>
            <div className="battle-buttons-container">
                <button 
                    className="battle-button create-match-button" 
                    onClick={handleComingSoon}
                >
                    Create Match
                </button>
                <button 
                    className="battle-button join-match-button" 
                    onClick={handleComingSoon}
                >
                    Join Match
                </button>
            </div>
            <SSSMatchBrowser />
        </>
    )
}

export default SSSBattle;