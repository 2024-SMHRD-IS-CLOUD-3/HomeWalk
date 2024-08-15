import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import kakaoLogo from '../assets/kakao-svgrepo-com.svg';
import { uploadKakaoProfileImage } from '../api/auth';
import { useAuth } from '../context/AuthContext'; // AuthContext에서 setUserObject 가져오기

export default function KakaoCallback() {
    const navigate = useNavigate();
    const [hasCalledApi, setHasCalledApi] = useState(false);
    const [dots, setDots] = useState('');
    const { setAvatarCustomization } = useAuth(); // useAuth에서 setAvatarCustomization 가져오기

    useEffect(() => {
        const fetchTokenAndRedirect = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (hasCalledApi) {
                return;
            }

            setHasCalledApi(true);

            console.log("Kakao login API called");

            if (code) {
                try {
                    const response = await fetch('/api/oauth/kakao', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });
                    const data = await response.json();

                    if (data.userId && data.jwt) {
                        const { userId, jwt: token, ...userInfo } = data;

                        await uploadKakaoProfileImage(token, userInfo.avatarCustomization);

                        if (localStorage.getItem('rememberMe')) {
                            localStorage.setItem('userInfo', JSON.stringify(userInfo));
                            localStorage.setItem('token', token);
                        } else {
                            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                            sessionStorage.setItem('token', token);
                        }

                        setAvatarCustomization(userInfo.avatarCustomization); // 사용자 객체 업데이트

                        navigate('/dashboard');
                    } else {
                        console.error('Login failed:', data.message);
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    navigate('/');
                }
            } else {
                console.error('Authorization code not found');
                navigate('/');
            }
        };

        fetchTokenAndRedirect();
    }, [hasCalledApi, navigate, setAvatarCustomization]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="white"
        >
            <Box component="img" src={kakaoLogo} alt="Kakao Logo" sx={{ width: 100, mb: 2 }} />
            <Typography variant="h5" color="textPrimary" sx={{ fontWeight: 'bold' }}>
                카카오 로그인 처리 중{dots}
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
        </Box>
    );
}
