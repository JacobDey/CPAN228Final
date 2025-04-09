import "../index.css";
import { useEffect, useState } from "react";

function MainMenu() {
    const [animateTitle, setAnimateTitle] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimateTitle(true), 500);
    }, []);

    return (
        <div className="main-menu-container">
            <h1 className={`main-menu-title ${animateTitle ? 'animate-title' : ''}`}>Triple Siege</h1>
            <div className="main-menu-buttons">
                <button className="main-menu-button play-button">Play</button>
                <button className="main-menu-button collection-button">Collection</button>
                <button className="main-menu-button login-button">Login</button>
                <button className="main-menu-button register-button">Register</button>
            </div>
        </div>
    );
}

export default MainMenu;