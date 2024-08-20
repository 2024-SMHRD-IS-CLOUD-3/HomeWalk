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
import { handleKakaoLogin } from '../utils/kakaoLogin';
import kakaoLogo from '../assets/kakao-svgrepo-com.svg';
import Copyright from '../components/Copyright';

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

        if (window.Kakao && !window.Kakao.isInitialized()) {
            console.log('Kakao SDK loaded and initializing');
            window.Kakao.init('cad60a30113d35de28e6be146cd5634a');
        } else {
            console.error('Kakao SDK not loaded or already initialized');
        }
    }, []);

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '100%', // 컨테이너의 전체 너비를 사용
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                    HomeWalk
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="아이디"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        sx={{ mb: 2 }}
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
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                        label="아이디 저장"
                        sx={{ mb: 2 }}
                    />
                    {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2, py: 1.5 }}
                    >
                        로그인
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleKakaoLogin}
                        sx={{
                            mt: 1,
                            mb: 2,
                            py: 1.5,
                            bgcolor: '#FEE500',
                            color: '#000',
                            ':hover': {
                                bgcolor: '#FDCB02',
                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img src={kakaoLogo} alt="Kakao Logo" style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                        카카오로 로그인
                    </Button>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Link component={RouterLink} to="/resetpassword" variant="body2">
                                비밀번호를 잊으셨나요?
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
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