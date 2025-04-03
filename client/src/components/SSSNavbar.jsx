import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router";

function SSSNavbar(){
    return(
        <Container>
            <Navbar fixed="top" bg="primary">
                <Navbar.Brand as={Link} to="/">Triple Siege</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/battle">Battle</Nav.Link>
                    <Nav.Link as={Link} to="/collection">Collection</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </Nav>
            </Navbar>
        </Container>
    );
}

export default SSSNavbar;