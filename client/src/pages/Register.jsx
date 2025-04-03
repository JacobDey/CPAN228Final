import { useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const SERVER_URL = "http://localhost:8080";

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post(`${SERVER_URL}/users/register`, {
                username,
                email,
                password
            });
            alert("Register successful");
            navigate("/login");
        } catch (error) {
            setError(error.response.data);
        }
    }

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister} className="register-form">
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>

            {/* show error if any */}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default Register;