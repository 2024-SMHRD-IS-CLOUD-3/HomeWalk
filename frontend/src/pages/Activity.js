import React, { useState, useEffect } from 'react';
import { Box, Toolbar, Typography } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { getStepsByUserId } from '../api/api';
import { useAuth } from '../context/AuthContext';
import TodayStepsCard from './MyActivity/TodayStepsCard';
import WeeklyStepsCard from './MyActivity/WeeklyStepsCard';
import MonthlyStepsCard from './MyActivity/MonthlyStepsCard';
import StepsComparisonChart from './MyActivity/StepsComparisonChart';
import StepsTimelineChart from './MyActivity/StepsTimelineChart';
import HealthMetrics from './MyActivity/HealthMetrics';

const Activity = () => {
    const { userObject } = useAuth();
    const [open, setOpen] = useState(false);
    const [dailySteps, setDailySteps] = useState(0);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const fetchSteps = async () => {
            if (userObject) {
                console.log(userObject.userId);
                const stepsData = await getStepsByUserId(userObject.userId);
                console.log(stepsData);
                const totalSteps = stepsData.reduce((sum, entry) => sum + entry.stepsCount, 0);
                setDailySteps(totalSteps);
            }
        };

        fetchSteps();
    }, [userObject]);

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
                    <TodayStepsCard dailySteps={dailySteps} />
                    <WeeklyStepsCard currentWeekData={currentWeekData} weeklyGoal={70000} />
                    <MonthlyStepsCard currentWeekData={currentWeekData} monthlyGoal={300000} />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <StepsComparisonChart currentWeekData={currentWeekData} previousWeekData={previousWeekData} />
                    <StepsTimelineChart todayStepsData={todayStepsData} />
                </Box>
                <HealthMetrics weightData={weightData} familyData={familyData} COLORS={COLORS} />
            </Box>
        </Box>
    );
};

export default Activity;
