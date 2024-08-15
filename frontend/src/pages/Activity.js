import React, { useState, useEffect } from 'react';
import { Box, Toolbar, Typography } from '@mui/material';
import AppBarComponent from '../components/AppBarComponent';
import DrawerComponent from '../components/DrawerComponent';
import { getStepsByUserId, getPreviousWeekStepsByUserId } from '../api/api'; 
import { useAuth } from '../context/AuthContext'; 
import TodayStepsCard from './MyActivity/TodayStepsCard';
import WeeklyStepsCard from './MyActivity/WeeklyStepsCard';
import MonthlyStepsCard from './MyActivity/MonthlyStepsCard';
import StepsComparisonChart from './MyActivity/StepsComparisonChart';
import StepsTimelineChart from './MyActivity/StepsTimelineChart';
import HealthMetrics from './MyActivity/HealthMetrics';

const Activity = () => {
    const { userObject } = useAuth(); 
    const [open, setOpen] = useState(true); // false -> true값으로 변경
    const [dailySteps, setDailySteps] = useState(0); // 일일 걸음 수 상태
    const [currentMonthlyTotal, setCurrentMonthlyTotal] = useState(0); // 월간 총 걸음 수 상태
    const [currentWeekData, setCurrentWeekData] = useState([]); // 주간 걸음 수 데이터 상태
    const [todayStepsData, setTodayStepsData] = useState([]); // 시간대별 오늘의 걸음 수 데이터 상태
    const [previousWeekData, setPreviousWeekData] = useState([]); // 전주의 걸음 수 데이터 상태

    const toggleDrawer = () => {
        setOpen(!open); 
    };

    // 사용자 걸음 수 데이터를 가져오는 useEffect 훅
    useEffect(() => {
        const fetchSteps = async () => {
            if (userObject) {
                try {
                    const stepsData = await getStepsByUserId(userObject.userId); // 현재 사용자의 걸음 수 데이터 가져오기

                    const today = new Date().toISOString().split('T')[0]; // 오늘의 날짜 가져오기
                    const todayStepsData = stepsData.find(entry => entry.date === today); // 오늘의 걸음 수 데이터 필터링
                    const todaySteps = todayStepsData ? todayStepsData.stepsCount : 0; // 오늘의 걸음 수
                    setDailySteps(todaySteps); // 일일 걸음 수 상태 업데이트

                    if (todayStepsData && todayStepsData.hourlyData) {
                        const hourlyData = JSON.parse(todayStepsData.hourlyData); // 시간대별 걸음 수 데이터 파싱
                        const stepsTimeline = Object.keys(hourlyData).map(time => ({
                            time,
                            steps: hourlyData[time]
                        }));
                        setTodayStepsData(stepsTimeline); // 시간대별 걸음 수 데이터 상태 업데이트
                    }

                    const now = new Date();
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // 이번 주의 시작 날짜
                    const endOfWeek = new Date(now.setDate(now.getDate() + 6)); // 이번 주의 끝 날짜

                    const weekData = stepsData.filter(entry => {
                        const entryDate = new Date(entry.date);
                        return entryDate >= startOfWeek && entryDate <= endOfWeek; // 이번 주의 걸음 수 데이터 필터링
                    });

                    const monthData = stepsData.filter(entry => {
                        const entryDate = new Date(entry.date);
                        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear(); // 이번 달의 걸음 수 데이터 필터링
                    });

                    const monthTotal = monthData.reduce((sum, entry) => sum + entry.stepsCount, 0); // 월간 총 걸음 수 계산
                    setCurrentMonthlyTotal(monthTotal); // 월간 총 걸음 수 상태 업데이트

                    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
                    const weekStepsData = Array(7).fill({ steps: 0 }).map((_, index) => {
                        const targetDate = new Date(startOfWeek);
                        targetDate.setDate(targetDate.getDate() + index);
                        const stepsForDay = weekData.find(entry => new Date(entry.date).toDateString() === targetDate.toDateString())?.stepsCount || 0;
                        return { day: daysOfWeek[targetDate.getDay()], steps: stepsForDay }; // 주간 걸음 수 데이터 포맷팅
                    });
                    setCurrentWeekData(weekStepsData); // 주간 걸음 수 데이터 상태 업데이트
                } catch (error) {
                    console.error("Failed to fetch steps data:", error); // 오류 처리
                }
            }
        };

        // 전주의 걸음 수 데이터를 가져오는 함수
        const fetchPreviousWeekSteps = async () => {
            if (userObject) {
                try {
                    const previousWeekData = await getPreviousWeekStepsByUserId(userObject.userId); // 전주의 걸음 수 데이터 가져오기
                    const formattedData = previousWeekData.map(entry => ({
                        day: new Date(entry.date).getDay(), // 요일을 나타내기 위해 날짜를 요일로 변환
                        steps: entry.stepsCount
                    }));
                    setPreviousWeekData(formattedData); // 전주의 걸음 수 데이터 상태 업데이트
                } catch (error) {
                    console.error("Failed to fetch previous week steps data:", error); // 오류 처리
                }
            }
        };

        if (userObject) {
            fetchSteps(); // 현재 주의 걸음 수 데이터 가져오기
            fetchPreviousWeekSteps(); // 전주의 걸음 수 데이터 가져오기
        }
    }, [userObject]);

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
                    <TodayStepsCard dailySteps={dailySteps} /> {/* 일일 걸음 수 카드 */}
                    <WeeklyStepsCard currentWeekData={currentWeekData} weeklyGoal={70000} /> {/* 주간 걸음 수 카드 */}
                    <MonthlyStepsCard currentMonthlyTotal={currentMonthlyTotal} monthlyGoal={300000} /> {/* 월간 걸음 수 카드 */}
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <StepsComparisonChart currentWeekData={currentWeekData} previousWeekData={previousWeekData} /> {/* 주간 걸음 수 비교 차트 */}
                    <StepsTimelineChart todayStepsData={todayStepsData} /> {/* 시간대별 걸음 수 타임라인 차트 */}
                </Box>
                {userObject && <HealthMetrics userId={userObject.userId} />} {/* 건강 지표 컴포넌트 */}
            </Box>
        </Box>
    );
};

export default Activity;
