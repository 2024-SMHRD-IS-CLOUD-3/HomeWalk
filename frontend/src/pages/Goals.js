import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Card, CardContent, Typography, Slider, Button, Container, Tabs, Tab, Snackbar } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { saveGoals } from '../api/goals';
import { useAuth } from '../context/AuthContext';

const Goals = () => {
  const { userObject } = useAuth();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (userObject?.userId) { 
      console.log('Setting default goals for userId:', userObject.userId);
      setWeeklyGoal(0); 
      setMonthlyGoal(0);
    } else {
      console.warn('userId is not defined');
    }
  }, [userObject]);

  const handleSaveGoal = async () => {
    try {
      if (!userObject?.userId) {
        throw new Error('User ID is undefined');
      }
      await saveGoals(userObject.userId, 'weekly', weeklyGoal);
      await saveGoals(userObject.userId, 'monthly', monthlyGoal);
      console.log('Goals saved successfully');
    } catch (error) {
      console.error('Error saving goals:', error);
      showSnackbar('목표 저장에 실패했습니다.');
    }
  };

  const toggleDrawer = () => setOpen(!open);
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            가족 건강 걷기 대시보드
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 4 }}>
            <Tab label="목표 설정" />
            <Tab label="저장된 목표" />
          </Tabs>

          {activeTab === 0 ? (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                  나의 걷기 목표 설정
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography gutterBottom>주간 목표 걸음 수</Typography>
                  <Typography variant="h6" align="center">
                    {weeklyGoal.toLocaleString()} 걸음
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
                    {monthlyGoal.toLocaleString()} 걸음
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
          ) : (
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                  저장된 목표
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body1">
                    주간 목표: {weeklyGoal.toLocaleString()} 걸음
                  </Typography>
                  <Typography variant="body1">
                    월간 목표: {monthlyGoal.toLocaleString()} 걸음
                  </Typography>
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