import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [isLogIn, SetIsLogIn] = useState(localStorage.getItem('token'));

  // Initialize username from token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
        // Invalid token, remove it
        localStorage.removeItem('token');
        SetIsLogIn(false);
      }
    }
  }, []);

  const logIn = (token, username) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token); // Decode the JWT token
    // console.log("Token:", token); // Log the decoded token for debugging
    // console.log("Decoded Token:", decodedToken); // Log the decoded token for debugging
    setUsername(decodedToken.sub); // Assuming the username is stored in the "sub" field
    SetIsLogIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setUsername(null);
    SetIsLogIn(false);
  };

  return (
    <AuthContext.Provider value={{ username, isLogIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);