import React, { useState } from 'react';
import axios from 'axios';
import { Box, CssBaseline, Card, CardContent, Typography, Input, Slider, Button } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const Goals = () => {
  const [open, setOpen] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(70000);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyGoal, setMonthlyGoal] = useState(500000);
  const [familyWeeklyGoal, setFamilyWeeklyGoal] = useState(200000);
  const [familyMonthlyGoal, setFamilyMonthlyGoal] = useState(800000);

  const handleSaveGoal = async (goalType, goalValue) => {
    try {
      await axios.post('/api/goals/save', {
        goalType,
        goalValue,
        selectedDate
      });
      console.log(`${goalType} 목표가 저장되었습니다.`);
    } catch (error) {
      console.error(`${goalType} 목표 저장 중 오류가 발생했습니다.`, error);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          가족 건강 걷기 대시보드
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography>나의 주간 목표 걸음 수</Typography>
              <Box sx={{ my: 2 }}>
                <Input
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  fullWidth
                />
                <Slider
                  value={weeklyGoal}
                  max={100000}
                  step={1000}
                  onChange={(e, value) => setWeeklyGoal(value)}
                  valueLabelDisplay="auto"
                />
                <Typography variant="body2" color="text.secondary">
                  일일 평균: {Math.round(weeklyGoal / 7).toLocaleString()} 걸음
                </Typography>
              </Box>
              <Box>
                <Typography>목표 시작일</Typography>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => handleSaveGoal('weeklyGoal', weeklyGoal)} variant="contained" sx={{ width: '20%' }}>
                  저장하기
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography>나의 월간 목표 걸음 수</Typography>
              <Box sx={{ my: 2 }}>
                <Input
                  type="number"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                  fullWidth
                />
                <Slider
                  value={monthlyGoal}
                  max={500000}
                  step={1000}
                  onChange={(e, value) => setMonthlyGoal(value)}
                  valueLabelDisplay="auto"
                />
                <Typography variant="body2" color="text.secondary">
                  일일 평균: {Math.round(monthlyGoal / 30).toLocaleString()} 걸음
                </Typography>
              </Box>
              <Box>
                <Typography>목표 시작일</Typography>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => handleSaveGoal('monthlyGoal', monthlyGoal)} variant="contained" sx={{ width: '20%' }}>
                  저장하기
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography>우리 가족 주간 누적 목표 걸음 수</Typography>
              <Box sx={{ my: 2 }}>
                <Input
                  type="number"
                  value={familyWeeklyGoal}
                  onChange={(e) => setFamilyWeeklyGoal(Number(e.target.value))}
                  fullWidth
                />
                <Slider
                  value={familyWeeklyGoal}
                  max={300000}
                  step={1000}
                  onChange={(e, value) => setFamilyWeeklyGoal(value)}
                  valueLabelDisplay="auto"
                />
                <Typography variant="body2" color="text.secondary">
                  일일 평균: {Math.round(familyWeeklyGoal / 7).toLocaleString()} 걸음
                </Typography>
              </Box>
              <Box>
                <Typography>목표 시작일</Typography>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => handleSaveGoal('familyWeeklyGoal', familyWeeklyGoal)} variant="contained" sx={{ width: '20%' }}>
                  저장하기
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography>우리 가족 월간 목표 누적 걸음 수</Typography>
              <Box sx={{ my: 2 }}>
                <Input
                  type="number"
                  value={familyMonthlyGoal}
                  onChange={(e) => setFamilyMonthlyGoal(Number(e.target.value))}
                  fullWidth
                />
                <Slider
                  value={familyMonthlyGoal}
                  max={800000}
                  step={1000}
                  onChange={(e, value) => setFamilyMonthlyGoal(value)}
                  valueLabelDisplay="auto"
                />
                <Typography variant="body2" color="text.secondary">
                  일일 평균: {Math.round(familyMonthlyGoal / 30).toLocaleString()} 걸음
                </Typography>
              </Box>
              <Box>
                <Typography>목표 시작일</Typography>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={() => handleSaveGoal('familyMonthlyGoal', familyMonthlyGoal)} variant="contained" sx={{ width: '20%' }}>
                  저장하기
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Goals;