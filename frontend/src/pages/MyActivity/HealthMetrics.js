import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const HealthMetrics = ({ userId }) => {
    const storedHeight = localStorage.getItem('height');
    const storedWeight = localStorage.getItem('weight');

    const [height, setHeight] = useState(storedHeight ? parseInt(storedHeight, 10) : 170);
    const [weight, setWeight] = useState(storedWeight ? parseFloat(storedWeight) : 70);
    const [bmi, setBmi] = useState(0);
    const [weightRecords, setWeightRecords] = useState([]);
    const [walkedDays, setWalkedDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // 체중 기록을 가져오는 비동기 함수
        const fetchWeightRecords = async () => {
            try {
                const response = await axios.get(`/api/weight/${userId}`);
                setWeightRecords(response.data.length > 0 ? response.data : [{ date: 'N/A', weight: 0 }]);
            } catch (error) {
                console.error('Error fetching weight records:', error);
                setWeightRecords([{ date: 'N/A', weight: 0 }]);
            }
        };

        // 걸은 날을 가져오는 비동기 함수
        const fetchWalkedDays = async () => {
            try {
                const response = await axios.get(`/api/steps/walkedDays/${userId}`);
                const days = response.data.map(entry => entry.date);
                setWalkedDays(days);
            } catch (error) {
                console.error('Error fetching walked days:', error);
                setWalkedDays([]);
            }
        };

        fetchWeightRecords();
        fetchWalkedDays();
    }, [userId]);

    // BMI 계산 함수
    const calculateBMI = async () => {
        const bmiValue = weight / ((height / 100) ** 2);
        setBmi(bmiValue.toFixed(1));

        localStorage.setItem('height', height);
        localStorage.setItem('weight', weight);

        try {
            await axios.post('/api/weight', null, {
                params: {
                    userId,
                    weight
                }
            });
            const response = await axios.get(`/api/weight/${userId}`);
            setWeightRecords(response.data.length > 0 ? response.data : [{ date: 'N/A', weight: 0 }]);
        } catch (error) {
            console.error('Error saving weight record:', error);
            setWeightRecords([{ date: 'N/A', weight: 0 }]);
        }
    };

    // BMI 카테고리 반환 함수
    const getBMICategory = (bmiValue) => {
        if (bmiValue < 18.5) return '저체중';
        if (bmiValue < 25) return '정상';
        if (bmiValue < 30) return '과체중';
        return '비만';
    };

    // 특정 날짜를 하이라이트하는 함수
    const renderDay = (date, selectedDate, pickersDayProps) => {
        const isWalkedDay = walkedDays.includes(date.toISOString().split('T')[0]); // 걸음수가 있는 날인지 확인
        return (
            <div {...pickersDayProps}>
                {isWalkedDay ? (
                    <Box
                        sx={{
                            backgroundColor: '#4caf50', // 배경색을 초록색으로 설정
                            color: 'white', // 글자색을 흰색으로 설정
                            borderRadius: '50%', // 동그랗게 만들기
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {date.getDate()} {/* 날짜 표시 */}
                    </Box>
                ) : (
                    date.getDate() // 걸음수가 없는 날은 기본 날짜 표시
                )}
            </div>
        );
    };

    return (
        <>
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
                        <Button
                            variant="contained"
                            onClick={calculateBMI}
                            sx={{ mb: 1, width: '100%' }}
                        >
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
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightRecords}>
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
                        <Typography variant="h6" gutterBottom>걸은 날 캘린더</Typography>
                        <Box sx={{ height: 300 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <StaticDatePicker
                                    displayStaticWrapperAs="desktop"
                                    openTo="day"
                                    value={selectedDate}
                                    onChange={(newValue) => setSelectedDate(newValue)}
                                    renderDay={renderDay}
                                    slots={{ textField: (params) => <TextField {...params} /> }} // 변경된 부분
                                />
                            </LocalizationProvider>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default HealthMetrics;
