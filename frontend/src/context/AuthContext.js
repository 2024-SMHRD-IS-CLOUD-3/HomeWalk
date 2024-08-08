import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = sessionStorage.getItem('userId');
    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    navigate('/'); // 로그아웃 후 로그인 페이지로 리디렉션
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
