import React, { useState } from 'react';
import { Box, Toolbar, Card, CardContent, Typography, LinearProgress, TextField, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';

const currentWeekData = [
    { day: '월', steps: 8000 },
    { day: '화', steps: 10000 },
    { day: '수', steps: 9000 },
    { day: '목', steps: 7500 },
    { day: '금', steps: 11000 },
    { day: '토', steps: 13000 },
    { day: '일', steps: 6000 },
];

const previousWeekData = [
    { day: '월', steps: 7000 },
    { day: '화', steps: 8500 },
    { day: '수', steps: 9500 },
    { day: '목', steps: 7000 },
    { day: '금', steps: 12000 },
    { day: '토', steps: 12500 },
    { day: '일', steps: 5500 },
];

const todayStepsData = [
    { time: '00:00', steps: 0 },
    { time: '03:00', steps: 0 },
    { time: '06:00', steps: 500 },
    { time: '09:00', steps: 2000 },
    { time: '12:00', steps: 4500 },
    { time: '15:00', steps: 7000 },
    { time: '18:00', steps: 9500 },
    { time: '21:00', steps: 11000 },
];

const weightData = [
    { date: '07/01', weight: 70 },
    { date: '07/08', weight: 69.5 },
    { date: '07/12', weight: 69 },
    { date: '07/19', weight: 68.5 },
    { date: '07/25', weight: 68 },
    { date: '08/01', weight: 67.8 },
    { date: '08/08', weight: 67.5 },
];

const familyData = [
    { name: '아빠', value: 80 },
    { name: '엄마', value: 95 },
    { name: '아들', value: 70 },
    { name: '나', value: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE'];

const Activity = () => {
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [bmi, setBmi] = useState(0);

    const weeklyGoal = 70000;
    const monthlyGoal = 300000;

    const dailySteps = 8500;
    const caloriesPerThousandSteps = 50;
    const dailyCalories = (dailySteps / 1000) * caloriesPerThousandSteps;
    const currentWeeklyTotal = currentWeekData.reduce((sum, day) => sum + day.steps, 0);
    const monthlyTotal = currentWeeklyTotal * 4;

    const weeklyProgress = (currentWeeklyTotal / weeklyGoal) * 100;
    const monthlyProgress = (monthlyTotal / monthlyGoal) * 100;

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const calculateBMI = () => {
        const bmiValue = weight / ((height / 100) ** 2);
        setBmi(bmiValue.toFixed(1));
    };

    const getBMICategory = (bmiValue) => {
        if (bmiValue < 18.5) return '저체중';
        if (bmiValue < 25) return '정상';
        if (bmiValue < 30) return '과체중';
        return '비만';
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
            <DrawerComponent open={open} toggleDrawer={toggleDrawer} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${240}px)` },
                }}
            >
                <Toolbar />
                <Typography variant="h4" gutterBottom>
                    나의 활동(Activity)
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                    <Card>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: '#007FFF',
                                '&:hover': {
                                    bgcolor: '#0066CC',
                                },
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h5">오늘의 걸음 수</Typography>
                            <Typography variant="h4">{dailySteps.toLocaleString()}</Typography>
                            <Typography variant="h6">소모된 칼로리</Typography>
                            <Typography variant="h6">{dailyCalories.toFixed(2)} kcal</Typography>
                        </Box>
                    </Card>
                    <Card>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: '#FFBB28',
                                '&:hover': {
                                    bgcolor: '#FFA726',
                                },
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6">이번 주 총 걸음 수</Typography>
                            <Typography variant="h4">{currentWeeklyTotal.toLocaleString()}</Typography>
                            <LinearProgress variant="determinate" value={weeklyProgress} sx={{ my: 1, width: '80%', bgcolor: 'white' }} />
                            <Typography variant="body2">{weeklyProgress.toFixed(1)}% 달성</Typography>
                        </Box>
                    </Card>
                    <Card>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: '#00C49F',
                                '&:hover': {
                                    bgcolor: '#00A676',
                                },
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6">월간 총 걸음 수</Typography>
                            <Typography variant="h4">{monthlyTotal.toLocaleString()}</Typography>
                            <LinearProgress variant="determinate" value={monthlyProgress} sx={{ my: 1, width: '80%', bgcolor: 'white' }} />
                            <Typography variant="body2">{monthlyProgress.toFixed(1)}% 달성</Typography>
                        </Box>
                    </Card>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>주간 걸음 수 비교</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={currentWeekData.map((data, index) => ({
                                        day: data.day,
                                        current: data.steps,
                                        previous: previousWeekData[index].steps,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="current" fill="#8884d8" name="이번 주 걸음 수">
                                            <LabelList dataKey="current" position="top" style={{ fill: '#8884d8', fontWeight: 'bold' }} />
                                        </Bar>
                                        <Bar dataKey="previous" fill="#82ca9d" name="저번 주 걸음 수">
                                            <LabelList dataKey="previous" position="top" style={{ fill: '#82ca9d', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>걸음수 타임라인</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={todayStepsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="time"
                                            interval={3}
                                            tickFormatter={(time) => time.split(':')[0]}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            labelFormatter={(label) => `시간: ${label}`}
                                            formatter={(value) => [`${value} 걸음`, '걸음 수']}
                                        />
                                        <Line type="monotone" dataKey="steps" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                    건강 지표
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>BMI 계산기</Typography>
                            <TextField
                                label="키 (cm)"
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                sx={{ mb: 1, width: '100%' }}
                            />
                            <TextField
                                label="체중 (kg)"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                sx={{ mb: 1, width: '100%' }}
                            />
                            <Button variant="contained" onClick={calculateBMI} sx={{ mb: 1, width: '100%' }}>
                                BMI 계산
                            </Button>
                            {bmi > 0 && (
                                <Typography>
                                    BMI: {bmi} ({getBMICategory(bmi)})
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>체중 변화</Typography>
                            <Box sx={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weightData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>가족 목표 달성률</Typography>
                            <Box sx={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={familyData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {familyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Activity;
