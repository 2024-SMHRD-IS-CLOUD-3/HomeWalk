import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 경로에 맞게 수정
import { DrawerProvider } from './context/DrawerContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import Families from './pages/Families';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Activity from './pages/Activity';
import Goals from './pages/Goals';
import Posture from './pages/Posture';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost';
import { FamilyProvider } from './context/FamilyContext';
import KakaoCallback from './components/KakaoCallback';
import './fonts.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <FamilyProvider>
            <DrawerProvider>
              <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/ResetPasswordPage" element={<ResetPasswordPage />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/profile/" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/families" element={<Families />} />
                <Route path="/posture" element={<Posture />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/community" element={<Community />} />
                <Route path="/createpost" element={<CreatePost />} />
                <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
              </Routes>
            </DrawerProvider>
          </FamilyProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider >
  );
}

export default App;
