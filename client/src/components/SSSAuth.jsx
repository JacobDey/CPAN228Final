import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const logIn = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token); // Decode the JWT token
    console.log("Token:", token); // Log the decoded token for debugging
    console.log("Decoded Token:", decodedToken); // Log the decoded token for debugging
    setUsername(decodedToken.sub); // Assuming the username is stored in the "sub" field
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);