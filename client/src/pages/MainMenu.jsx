import { useNavigate } from 'react-router-dom';
import "../index.css";
import { useEffect, useState } from "react";

function MainMenu() {
    const navigate = useNavigate();
    const [animateTitle, setAnimateTitle] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimateTitle(true), 500);
    }, []);

    return (
        <div className="main-menu-container">
            <h1 className={`main-menu-title ${animateTitle ? 'animate-title' : ''}`}>Triple Siege</h1>
            <div className="main-menu-buttons">
                <button className="main-menu-button play-button" onClick={() => navigate('/battle')}>Battle</button>
                <button className="main-menu-button collection-button" onClick={() => navigate('/collection')}>Collection</button>
                <button className="main-menu-button login-button" onClick={() => navigate('/login')}>Login</button>
                <button className="main-menu-button register-button" onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
}

export default MainMenu;