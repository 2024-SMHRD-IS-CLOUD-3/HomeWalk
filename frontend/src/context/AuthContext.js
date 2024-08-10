import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userInfo'));
  const [userObject, setUserObject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (storedUserInfo && token) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setIsAuthenticated(true);
      setUserObject(parsedUserInfo);
    } else {
      setIsAuthenticated(false);
      setUserObject(null);
    }
  }, []);

  const login = async (token, userInfo, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token); // Token 따로 저장
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      sessionStorage.setItem('token', token); // Token 따로 저장
    }
    
    setIsAuthenticated(true);
    setUserObject(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserObject(null);
    navigate('/'); // 로그아웃 후 로그인 페이지로 리디렉션
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userObject, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
