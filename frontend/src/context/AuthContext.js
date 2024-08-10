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

  // 추가된 함수: 아바타 URL 업데이트
  const setAvatarCustomization = (newAvatarUrl) => {
    setUserObject((prev) => ({ ...prev, avatarCustomization: newAvatarUrl }));

    // 로컬 스토리지 또는 세션 스토리지에 업데이트된 userInfo 저장
    if (localStorage.getItem('userInfo')) {
      const updatedUserInfo = { ...JSON.parse(localStorage.getItem('userInfo')), avatarCustomization: newAvatarUrl };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    } else if (sessionStorage.getItem('userInfo')) {
      const updatedUserInfo = { ...JSON.parse(sessionStorage.getItem('userInfo')), avatarCustomization: newAvatarUrl };
      sessionStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userObject, login, logout, setAvatarCustomization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
