import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Card, CardContent, Typography, Slider, Button, Container, Tabs, Tab, Snackbar } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { useAuth } from '../context/AuthContext';
import { useDrawer } from '../context/DrawerContext';
import { fetchGoals, saveGoals } from '../api/goals';

const Goals = () => {
  const { userObject } = useAuth();
  const { open, toggleDrawer } = useDrawer();
  const [activeTab, setActiveTab] = useState(0); // 기본 탭을 '저장된 목표'로 설정
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadGoals = async () => {
      if (userObject?.userId) {
        try {
          const goals = await fetchGoals(userObject.userId);
          setWeeklyGoal(goals.weekly || 0); // 이름 변경에 따른 수정
          setMonthlyGoal(goals.monthly || 0); // 이름 변경에 따른 수정
        } catch (error) {
          console.error('Failed to load goals:', error);
          showSnackbar('목표를 불러오는데 실패했습니다.');
        }
      }
    };

    loadGoals();
  }, [userObject]);

  const handleSaveGoal = async () => {
    try {
      if (!userObject?.userId) {
        throw new Error('User ID is undefined');
      }

      // 주간 목표 저장
      await saveGoals(userObject.userId, 'weekly', weeklyGoal);
      // 월간 목표 저장
      await saveGoals(userObject.userId, 'monthly', monthlyGoal);

      showSnackbar('목표가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error saving goals:', error);
      showSnackbar('목표 저장에 실패했습니다.');
    }
  };

  const handleTabChange = (_, newValue) => setActiveTab(newValue);
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            가족 건강 걷기 대시보드
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 4 }}>
            <Tab label="저장된 목표" />
            <Tab label="목표 설정" />
          </Tabs>

          {activeTab === 0 ? (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                  저장된 목표
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body1">
                    주간 목표: {weeklyGoal ? weeklyGoal.toLocaleString() : '0'} 걸음
                  </Typography>
                  <Typography variant="body1">
                    월간 목표: {monthlyGoal ? monthlyGoal.toLocaleString() : '0'} 걸음
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                  나의 걷기 목표 설정
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography gutterBottom>주간 목표 걸음 수</Typography>
                  <Typography variant="h6" align="center">
                    {weeklyGoal ? weeklyGoal.toLocaleString() : '0'} 걸음
                  </Typography>
                  <Slider
                    value={weeklyGoal}
                    max={100000}
                    step={1000}
                    onChange={(_, value) => setWeeklyGoal(value)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" sx={{ textAlign: 'center' }}>
                    일일 평균: {Math.round(weeklyGoal / 7).toLocaleString()} 걸음
                  </Typography>

                  <Typography gutterBottom>월간 목표 걸음 수</Typography>
                  <Typography variant="h6" align="center">
                    {monthlyGoal ? monthlyGoal.toLocaleString() : '0'} 걸음
                  </Typography>
                  <Slider
                    value={monthlyGoal}
                    max={1000000}
                    step={5000}
                    onChange={(_, value) => setMonthlyGoal(value)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" sx={{ textAlign: 'center' }}>
                    일일 평균: {Math.round(monthlyGoal / 30).toLocaleString()} 걸음
                  </Typography>

                  <Button 
                    onClick={handleSaveGoal} 
                    variant="contained" 
                    size="large"
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    저장하기
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Goals;
