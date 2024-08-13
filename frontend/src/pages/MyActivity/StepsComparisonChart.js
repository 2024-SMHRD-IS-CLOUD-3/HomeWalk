import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StepsComparisonChart = ({ currentWeekData = [], previousWeekData = [] }) => {
    // 데이터가 비어있을 경우 기본값 설정
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    // currentWeekData와 previousWeekData가 비어있는 경우 기본값으로 설정
    const formattedCurrentWeekData = currentWeekData.length > 0 ? currentWeekData : daysOfWeek.map(day => ({ day, steps: 0 }));
    const formattedPreviousWeekData = previousWeekData.length > 0 ? previousWeekData : daysOfWeek.map(day => ({ day, steps: 0 }));

    // 두 데이터를 병합하여 비교 데이터 생성
    const mergedData = formattedCurrentWeekData.map((current, index) => ({
        day: current.day,
        currentWeekSteps: current.steps,
        previousWeekSteps: formattedPreviousWeekData[index] ? formattedPreviousWeekData[index].steps : 0
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mergedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="currentWeekSteps" fill="#8884d8" name="이번 주" />
                <Bar dataKey="previousWeekSteps" fill="#82ca9d" name="저번 주" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StepsComparisonChart;
