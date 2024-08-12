import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate와 useLocation 추가
import { resetPassword } from '../api/auth'; // 비밀번호 재설정 API 함수

const defaultTheme = createTheme();

export default function ResetPasswordPage() {
    const navigate = useNavigate(); // useNavigate 사용
    const location = useLocation(); // 현재 위치 정보 가져오기
    const token = new URLSearchParams(location.search).get('token'); // URL에서 토큰 가져오기
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await resetPassword(token, newPassword); // 비밀번호 재설정 API 호출
            if (response.success) {
                setMessage('Password has been successfully reset. Redirecting to Sign In...');
                setTimeout(() => {
                    navigate('/'); // 로그인 페이지로 리다이렉트
                }, 2000); // 2초 후에 리다이렉트
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError('Failed to reset password.');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Set New Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {message && <Typography color="primary">{message}</Typography>}
                        {error && <Typography color="error">{error}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
