import React, { useState } from 'react';
import { Box, CssBaseline, Card, CardContent, Typography, Tabs, Tab, Input, Slider, TextField, Grid, Button, IconButton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F'];

const Goals = () => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(70000);
  const [weeklyTabValue, setWeeklyTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyGoal, setMonthlyGoal] = useState(500000);
  const [weightGoal, setWeightGoal] = useState(60); // 목표 몸무게
  const [currentWeight, setCurrentWeight] = useState(75); // 현재 몸무게

  const caloriesPerThousandSteps = 50;

  const [courses, setCourses] = useState(['']); // 코스 추천을 위한 상태
  const [rules, setRules] = useState(['', '', '', '', '']); // 초기 상태: 5개의 빈 문자열 배열

  const handleCourseChange = (index, event) => {
    const newCourses = [...courses];
    newCourses[index] = event.target.value;
    setCourses(newCourses);
  };

  const handleAddCourse = () => {
    setCourses([...courses, '']);
  };

  const handleRemoveCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const handleChange = (index, event) => {
    const newRules = [...rules];
    newRules[index] = event.target.value;
    setRules(newRules);
  };

  const handleAdd = () => {
    setRules([...rules, '']); // 새로운 빈 입력 필드를 추가
  };

  const handleRemove = (index) => {
    const newRules = rules.filter((_, i) => i !== index); // 선택한 필드를 제거
    setRules(newRules);
  };

  const goalData = [
    { name: '주간 목표(일일 평균 걸음 수)', stepsGoal: weeklyGoal / 7, caloriesGoal: (weeklyGoal / 1000) * caloriesPerThousandSteps },
    { name: '월간 목표(일일 평균 걸음 수)', stepsGoal: monthlyGoal / 30, caloriesGoal: (monthlyGoal / 1000) * caloriesPerThousandSteps },
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
                  {/* 걸음 수 바 */}
                  <Bar dataKey="stepsGoal" fill="red">
                  {goalData.map((entry, index) => (
                  <Cell key={`cell-${index}-steps`} fill="red" />
                   ))}
                  </Bar>
                 {/* 칼로리 바 */}
                 <Bar dataKey="caloriesGoal" fill="green">
                 {goalData.map((entry, index) => (
                 <Cell key={`cell-${index}-calories`} fill="green" />
                  ))}
                   </Bar>
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
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Card>
                <CardContent>
                <Typography>주간 누적 목표 걸음 수</Typography>
                {weeklyTabValue === 0 && (
                  <Box sx={{ my: 2 }}>
                    <Input
                      type="number"
                      value={weeklyGoal}
                      onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                      fullWidth
                    />
                    <Slider
                      value={weeklyGoal}
                      max={300000}
                      step={1000}
                      onChange={(e, value) => setWeeklyGoal(value)}
                      valueLabelDisplay="auto"
                    />
                    <Typography variant="body2" color="text.secondary">
                      일일 평균: {Math.round(weeklyGoal / 7).toLocaleString()} 걸음
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
                <Typography>월간 목표 누적 걸음 수</Typography>
                {weeklyTabValue === 0 && (
                  <Box sx={{ my: 2 }}>
                    <Input
                      type="number"
                      value={monthlyGoal}
                      onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                      fullWidth
                    />
                    <Slider
                      value={monthlyGoal}
                      max={800000}
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
                  
                </CardContent>
              </Card>
              
              <Card>
              <CardContent>
              <Typography variant="h6">우리 가족 건강 수칙</Typography>
              <Grid container spacing={2}>
            {rules.map((rule, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`수칙 ${index + 1}`}
                variant="outlined"
                margin="normal"
                value={rule}
                onChange={(event) => handleChange(index, event)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemove(index)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
             <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              추가
            </Button>
            </Box>
          </Grid>
        </Grid>    
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
