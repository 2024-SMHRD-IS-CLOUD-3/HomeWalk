import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 경로에 맞게 수정
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Families from './pages/Families';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Activity from './pages/Activity';
import Goals from './pages/Goals';
import { FamilyProvider } from './context/FamilyContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FamilyProvider>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/profile/" element={<Profile />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/families" element={<Families />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </FamilyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
