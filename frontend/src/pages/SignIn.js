import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { handleKakaoLogin } from '../utils/kakaoLogin'; // 카카오 로그인 로직을 불러옵니다
import kakaoLogo from '../assets/kakao-svgrepo-com.svg'; // 이미지 파일 경로를 지정합니다.

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Five Stars
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const password = data.get('password');

        try {
            const response = await loginUser({ username, password });
            console.log('Response:', response);

            if (response.jwt) {
                const userInfo = {
                    userId: response.userId,
                    username: response.username,
                    email: response.email,
                    avatarCustomization: response.avatarCustomization,
                    dailyStepGoal: response.dailyStepGoal,
                    weeklyStepGoal: response.weeklyStepGoal,
                    monthlyStepGoal: response.monthlyStepGoal,
                    isActive: response.isActive,
                };

                if (rememberMe) {
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    localStorage.setItem('token', response.jwt);
                } else {
                    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                    sessionStorage.setItem('token', response.jwt);
                }

                login(response.jwt, userInfo, rememberMe);

                navigate('/dashboard', { replace: true });
            } else {
                setErrorMessage('Login failed. Please check your username and password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);

            if (error.response && error.response.data) {
                // 서버에서 반환한 에러 메시지 사용
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('Login failed. Please try again later.');
            }
        }

    };

    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberMe');
        if (rememberedUsername) {
            document.getElementById('username').value = rememberedUsername;
            setRememberMe(true);
        }

        // 카카오 SDK 초기화 확인
        if (window.Kakao && !window.Kakao.isInitialized()) { // SDK가 로드되고 초기화되지 않았는지 확인
            console.log('Kakao SDK loaded and initializing');
            window.Kakao.init('cad60a30113d35de28e6be146cd5634a');
        } else {
            console.error('Kakao SDK not loaded or already initialized');
        }
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    HomeWalk
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="아이디"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="비밀번호"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                        label="아이디 저장"
                    />
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        로그인
                    </Button>
                    {/* 카카오 로그인 버튼 */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleKakaoLogin}
                        sx={{
                            mt: 1,
                            mb: 2,
                            bgcolor: '#FEE500', // 기본 배경색
                            color: '#000',      // 기본 텍스트 색상
                            ':hover': {
                                bgcolor: '#FDCB02', // 마우스를 올렸을 때 진한 노란색으로 변경
                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <img src={kakaoLogo} alt="Kakao Logo" style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                        카카오로 로그인
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RouterLink} to="/resetpassword" variant="body2">
                                비밀번호를 잊으셨나요?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {"계정이 없으신가요? 회원가입"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
