import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./SSSAuth";
import { useNavigate } from "react-router-dom";

function SSSNavbar() {
    const [expanded, setExpanded] = useState(false);
    const { isLogIn, logOut } = useAuth();
    const navigate = useNavigate();

    return (
        <Navbar
            expand="lg"
            fixed="top"
            bg="dark"
            variant="dark"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            style={{
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            }}
        >
            <Container fluid>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    style={{
                        fontFamily: "'Bangers', cursive",
                        fontSize: "1.8rem",
                        letterSpacing: "1px",
                        color: "#4cc9f0",
                        textShadow: "0 0 5px rgba(76, 201, 240, 0.5)"
                    }}
                    onClick={() => setExpanded(false)}
                >
                    Triple Siege
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                {isLogIn ?
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link
                                as={Link}
                                to="/battle"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">⚔️</span> Battle
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/guide"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">🎯</span> How to play
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/collection"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">🃏</span> Collection
                            </Nav.Link>
                            <Nav.Link
                                as="button"
                                className="nav-link-custom bg-transparent border-0"
                                onClick={() => {
                                    logOut();
                                    setExpanded(false);
                                    navigate("/");
                                    alert("Log Out Successfully");
                                }}
                            >
                                <span className="nav-icon">🔑</span> Logout
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/profile"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">📝</span> Profile
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    :
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link
                                as={Link}
                                to="/guide"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">🎯</span> How to play
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/cards"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">🃏</span> Card List
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/login"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">🔑</span> Login
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/register"
                                className="nav-link-custom"
                                onClick={() => setExpanded(false)}
                            >
                                <span className="nav-icon">📝</span> Register
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                }
            </Container>
        </Navbar>
    );
}

export default SSSNavbar;