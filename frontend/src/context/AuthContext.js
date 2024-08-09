import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../api/profile'; // 사용자 정보를 가져오는 API 함수

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
  const [avatarCustomization, setAvatarCustomization] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = sessionStorage.getItem('userId');

    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);

      // 사용자 정보를 가져오는 로직
      const fetchUserData = async () => {
        try {
          const userData = await fetchUserProfile(token);
          const { avatarCustomization } = userData;
          setAvatarCustomization(avatarCustomization); // 아바타 URL 설정
        } catch (error) {
          console.error('Failed to fetch user data', error);
          setIsAuthenticated(false);
          setUserId(null);
        }
      };

      fetchUserData();
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  const login = async (token, userId) => {
    localStorage.setItem('token', token);
    sessionStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setUserId(userId);

    // 로그인 후 사용자 정보를 가져와 아바타 URL 설정
    const fetchUserData = async () => {
      try {
        const userData = await fetchUserProfile(token);
        const { avatarCustomization } = userData;
        setAvatarCustomization(avatarCustomization); // 아바타 URL 설정
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    await fetchUserData(); // 사용자 데이터 가져오기
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setAvatarCustomization(null); // 로그아웃 시 아바타 URL 초기화
    navigate('/'); // 로그아웃 후 로그인 페이지로 리디렉션
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, avatarCustomization, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
