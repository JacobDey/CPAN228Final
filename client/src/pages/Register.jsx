import { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import { Container, Form, Button, Alert } from "react-bootstrap";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

    const handleRegister = async (e) => {
        e.preventDefault();

        //clear error
        setErrors({});
        setGeneralError(null);

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }
        try {
            await axios.post(`${SERVER_URL}/users/register`, {
                username,
                email,
                password
            });
            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data) {
                //validation error
                if (typeof error.response.data === 'object') {
                    setErrors(error.response.data);
                } else {
                    //general error
                    setGeneralError(error.response.data);
                }
            } else {
                // For other errors
                setGeneralError(error.response?.data || "Registration failed");
            }
        }
    }

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
            }}>Create Account</h1>
            
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#555', fontWeight: '500' }}>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        isInvalid={!!errors.username}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            color: '#333',
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#555', fontWeight: '500' }}>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        isInvalid={!!errors.email}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            color: '#333',
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#555', fontWeight: '500' }}>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        isInvalid={!!errors.password}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            color: '#333',
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#555', fontWeight: '500' }}>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        isInvalid={!!errors.confirmPassword}
                        style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            color: '#333',
                            padding: '12px',
                            borderRadius: '8px'
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                {generalError && <Alert variant="danger" className="text-center" style={{ borderRadius: '8px' }}>{generalError}</Alert>}

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
                    Sign Up
                </Button>

                <div style={{
                    textAlign: 'center',
                    marginTop: '25px',
                    color: '#666'
                }}>
                    Already have an account?{' '}
                    <Button 
                        variant="link" 
                        onClick={() => navigate('/login')}
                        style={{
                            color: '#4361ee',
                            textDecoration: 'none',
                            padding: '0',
                            fontWeight: '500'
                        }}
                    >
                        Sign in
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

export default Register;