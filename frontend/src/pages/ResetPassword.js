import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { sendResetPasswordEmail } from '../api/auth'; // 이메일 전송 API 함수
import Copyright from '../components/Copyright';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // 이메일을 서버로 전송하여 비밀번호 재설정 링크 요청
            const response = await sendResetPasswordEmail(email);
            if (response.success) {
                setMessage('암호 재설정 메일을 보냈습니다. 메일을 확인하세요.');
            } else {
                setError('암호 재설정 메일을 보내지 못했습니다.');
            }
        } catch (error) {
            setError('Failed to send password reset email.');
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
                    backgroundColor: 'background.paper',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                    비밀번호 수정
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="이메일 주소"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {message && <Typography color="primary" sx={{ mb: 2 }}>{message}</Typography>}
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2, py: 1.5 }}
                    >
                        수정 링크 보내기
                    </Button>
                </Box>
            </Box>
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Copyright />
            </Box>
        </Container>
    );
}