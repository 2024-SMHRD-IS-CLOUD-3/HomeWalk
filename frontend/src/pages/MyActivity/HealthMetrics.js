import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 스타일 임포트
import axios from 'axios';

const HealthMetrics = ({ userId }) => {
    const storedHeight = localStorage.getItem('height');
    const storedWeight = localStorage.getItem('weight');

    const [height, setHeight] = useState(storedHeight ? parseInt(storedHeight, 10) : 170);
    const [weight, setWeight] = useState(storedWeight ? parseFloat(storedWeight) : 70);
    const [bmi, setBmi] = useState(0);
    const [weightRecords, setWeightRecords] = useState([]);
    const [walkedDays, setWalkedDays] = useState([]);

    useEffect(() => {
        const fetchWeightRecords = async () => {
            try {
                const response = await axios.get(`/api/weight/${userId}`);
                setWeightRecords(response.data.length > 0 ? response.data : [{ date: 'N/A', weight: 0 }]);
            } catch (error) {
                console.error('Error fetching weight records:', error);
                setWeightRecords([{ date: 'N/A', weight: 0 }]);
            }
        };

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

    const getBMICategory = (bmiValue) => {
        if (bmiValue < 18.5) return '저체중';
        if (bmiValue < 25) return '정상';
        if (bmiValue < 30) return '과체중';
        return '비만';
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && walkedDays.find(d => d === date.toISOString().split('T')[0])) {
            return 'highlight';
        }
        return null;
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
                        <Box sx={{ height: 400 }}>
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
                        <Box sx={{ height: 400 }}>
                            <Calendar
                                tileClassName={tileClassName}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default HealthMetrics;
