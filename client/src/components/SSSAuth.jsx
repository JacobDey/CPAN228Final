import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const logIn = (token) => {
    localStorage.setItem('token', token);
  };

  const logOut = () => {
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
