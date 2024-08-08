import React, { useState } from 'react';
import { Box, CssBaseline, Card, CardContent, Typography, Tabs, Tab, Avatar, Input, Slider, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const COLORS = ['#0088FE', '#00C49F'];

const familyData = [
  { name: '아빠', steps: 12000, distance: 9.5, calories: 450, weight: 75, avatar: '👨' },
  { name: '엄마', steps: 11000, distance: 8.7, calories: 410, weight: 60, avatar: '👩' },
  { name: '아들', steps: 15000, distance: 12.3, calories: 550, weight: 55, avatar: '👦' },
  { name: '딸', steps: 13000, distance: 10.5, calories: 490, weight: 50, avatar: '👧' },
];

const weekData = [
  { day: '월', steps: 8000 },
  { day: '화', steps: 10000 },
  { day: '수', steps: 9000 },
  { day: '목', steps: 7500 },
  { day: '금', steps: 11000 },
  { day: '토', steps: 13000 },
  { day: '일', steps: 6000 },
];

const Goals = () => {
  const [open, setOpen] = useState(true);
  const [selectedMember, setSelectedMember] = useState(familyData[0]);
  const [activeTab, setActiveTab] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(70000);
  const [weeklyTabValue, setWeeklyTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyGoal, setMonthlyGoal] = useState(500000);
  const [weightGoal, setWeightGoal] = useState(60); // 목표 몸무게
  const [currentWeight, setCurrentWeight] = useState(75); // 현재 몸무게

  const caloriesPerThousandSteps = 50;

  const goalData = [
    { name: '주간 목표(일일 평균 걸음 수)', goal: weeklyGoal / 7 },
    { name: '주간 (예상 칼로리 소모량)', goal: (weeklyGoal / 1000) * caloriesPerThousandSteps },
    { name: '월간 목표(일일 평균 걸음 수)', goal: monthlyGoal / 30 },
    { name: '월간 (예상 칼로리 소모량)', goal: (monthlyGoal / 1000) * caloriesPerThousandSteps },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleWeeklyTabChange = (event, newValue) => {
    setWeeklyTabValue(newValue);
  };

  const weightData = [
    { name: '목표 몸무게', value: weightGoal },
    { name: '현재 감량 몸무게', value: currentWeight - weightGoal },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
      <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          가족 건강 걷기 대시보드
        </Typography>
        
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="family health tabs">
          <Tab label="나의 목표" />
          <Tab label="우리 가족 목표" />
        </Tabs>
        
        {activeTab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Card>
              <CardContent>
                <Tabs value={weeklyTabValue} onChange={handleWeeklyTabChange} aria-label="weekly goal tabs">
                  <Tab label="주간" />
                  <Tab label="월간" />
                </Tabs>
                {weeklyTabValue === 0 && (
                  <Box sx={{ my: 2 }}>
                    <Typography>나의 주간 목표 걸음 수</Typography>
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
                )}
                {weeklyTabValue === 1 && (
                  <Box sx={{ my: 2 }}>
                    <Typography>나의 월간 목표 걸음 수</Typography>
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
                )}
                <Box>
                  <Typography>목표 시작일</Typography>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">목표 걸음 수/예상 칼로리</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={goalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="goal" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">체중 목표 달성도</Typography>
                <Box sx={{ mb: 2 }}>
                <Typography>현재 몸무게</Typography>
                  <Input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    fullWidth
                  />
                  <Typography>목표 몸무게</Typography>
                  <Input
                    type="number"
                    value={weightGoal}
                    onChange={(e) => setWeightGoal(Number(e.target.value))}
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>

                <Card>
                <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={weightData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Typography variant="body2" color="text" className="text-center mt-4">
                  현재 몸무게: {currentWeight} kg / 목표 몸무게: {weightGoal} kg
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
              {familyData.map((member) => (
                <Avatar key={member.name} onClick={() => setSelectedMember(member)} sx={{ cursor: 'pointer' }}>
                  {member.avatar}
                </Avatar>
              ))}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{selectedMember.name}의 프로필</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 96, height: 96, fontSize: '4rem' }}>
                      {selectedMember.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedMember.name}</Typography>
                      <Typography>오늘 걸음수: {selectedMember.steps.toLocaleString()} 걸음</Typography>
                      <Typography>거리: {selectedMember.distance} km</Typography>
                      <Typography>소모 칼로리: {selectedMember.calories} kcal</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6">주간 걸음수</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weekData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="steps" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6">목표 설정</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">일일 목표</Typography>
                      <LinearProgress variant="determinate" value={80} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>12,000 / 15,000 걸음</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">주간 목표</Typography>
                      <LinearProgress variant="determinate" value={60} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>45,000 / 75,000 걸음</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">월간 목표</Typography>
                      <LinearProgress variant="determinate" value={40} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>200,000 / 500,000 걸음</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Goals;
