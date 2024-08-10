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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

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
        // userInfo 객체에서 token을 분리하여 저장
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

        // Token은 별도로 저장
        if (rememberMe) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('token', response.jwt); // Token 따로 저장
        } else {
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          sessionStorage.setItem('token', response.jwt); // Token 따로 저장
        }

        // AuthContext의 login 함수 호출
        login(response.jwt, userInfo, rememberMe);
        navigate('/dashboard', { replace: true });
      } else {
        console.error('No token found in response');
        setErrorMessage('Login failed. Please check your username and password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Login failed. Please try again later.');
    }
  };

  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberMe');
    if (rememberedUsername) {
      document.getElementById('username').value = rememberedUsername;
      setRememberMe(true);
    }
  }, []);

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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
              label="Remember me"
            />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
