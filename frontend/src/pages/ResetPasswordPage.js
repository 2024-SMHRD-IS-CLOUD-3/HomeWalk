import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate와 useLocation 추가
import { resetPassword } from '../api/auth'; // 비밀번호 재설정 API 함수
import Copyright from '../components/Copyright';


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
                        비밀번호 설정
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="새로운 비밀번호"
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
                            label="비밀번호 확인"
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
                            비밀번호 수정
                        </Button>
                    </Box>
                </Box>
                <Box
                 component="footer"
                 sx={{
                 py: 3,
                 px: 2,
                 position: 'fixed',
                 bottom: 0,
                 width: '20%',
                 display: 'flex',
                 justifyContent: 'center', // 수평 중앙 정렬
                 alignItems: 'center', // 수직 중앙 정렬
               }}
                >
                <Copyright />
               </Box>
            </Container>
    );
}
