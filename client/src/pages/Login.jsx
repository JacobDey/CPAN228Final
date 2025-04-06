import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from '../components/SSSAuth';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { logIn } = useAuth() // use login function from auth
    const SERVER_URL = "http://localhost:8080";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${SERVER_URL}/users/login`, {
                username,
                password
            });
            logIn(response.data); // call login function to store token
            navigate('/')
        } catch (error) {
            setError(error.response.data);
        }
    }

    // Use navigate function to go to register page
    const goToRegister = () => {
        navigate('/register');
    };


    return (
        <div className="login-page-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" >Login</button>
        {/* show error if any */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="button" onClick={goToRegister} style={{marginTop: "20px"}}>Create an account</button>
      </form>
    </div>
    )
}

export default Login;