import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from '../components/SSSAuth';
import axios from 'axios';
import { Container, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { logIn } = useAuth();
    const SERVER_URL = "http://localhost:8080";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${SERVER_URL}/users/login`, {
                username,
                password
            });
            logIn(response.data);
            navigate('/');
        } catch (error) {
            setError(error.response?.data || "Login failed");
        }
    }

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <Container className="auth-container" style={{
            maxWidth: '500px',
            padding: '100px',
            borderRadius: '15px',
            backgroundColor: 'white',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0'
        }}>
            <h1 style={{
                textAlign: 'center',
                color: '#4361ee',
                marginBottom: '30px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600'
            }}>Welcome Back</h1>
            
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#555', fontWeight: '500' }}>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            color: '#333',
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#555', fontWeight: '500' }}>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            color: '#333',
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                </Form.Group>

                {error && <Alert variant="danger" className="text-center" style={{ borderRadius: '8px' }}>{error}</Alert>}

                <Button 
                    variant="primary" 
                    type="submit" 
                    style={{
                        width: '100%',
                        marginTop: '10px',
                        backgroundColor: '#4361ee',
                        border: 'none',
                        fontWeight: '500',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                    className="hover-effect"
                >
                    Sign In
                </Button>

                <div style={{
                    textAlign: 'center',
                    marginTop: '25px',
                    color: '#666'
                }}>
                    Don't have an account?{' '}
                    <Button 
                        variant="link" 
                        onClick={goToRegister}
                        style={{
                            color: '#4361ee',
                            textDecoration: 'none',
                            padding: '0',
                            fontWeight: '500'
                        }}
                    >
                        Create one
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

export default Login;