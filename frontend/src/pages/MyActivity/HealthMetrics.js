import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Slider, Grid } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

const HealthMetrics = ({ userId }) => {
    const storedHeight = localStorage.getItem('height');
    const storedWeight = localStorage.getItem('weight');

    const [height, setHeight] = useState(storedHeight ? parseInt(storedHeight, 10) : 170);
    const [weight, setWeight] = useState(storedWeight ? parseFloat(storedWeight) : 70);
    const [bmi, setBmi] = useState(0);
    const [weightRecords, setWeightRecords] = useState([]);

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
        fetchWeightRecords();
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

    // 추가 카테고리 컬러
    const getBMICategoryColor = (bmiValue) => {
        if (bmiValue < 18.5) return '#3498db';
        if (bmiValue < 25) return '#2ecc71';
        if (bmiValue < 30) return '#f39c12';
        return '#e74c3c';
    };

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                건강 지표
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        BMI 계산기
                    </Typography>
                        {/* <TextField
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
                        /> */}
                                            <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography gutterBottom>키 (cm)</Typography>
                            <Slider
                                value={height}
                                onChange={(_, newValue) => setHeight(newValue)}
                                aria-labelledby="height-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                min={100}
                                max={250}
                                sx={{ color: '#3498db' }}
                            />
                            <TextField
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                type="number"
                                size="small"
                                sx={{ width: '100%', mt: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>체중 (kg)</Typography>
                            <Slider
                                value={weight}
                                onChange={(_, newValue) => setWeight(newValue)}
                                aria-labelledby="weight-slider"
                                valueLabelDisplay="auto"
                                step={0.1}
                                min={30}
                                max={200}
                                sx={{ color: '#2ecc71' }}
                            />
                            <TextField
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                type="number"
                                size="small"
                                sx={{ width: '100%', mt: 1 }}
                            />
                        </Grid>
                    </Grid>
                        <Button
                            variant="contained"
                            onClick={calculateBMI}
                            sx={{ mt: 3, width: '100%', bgcolor: '#34495e', '&:hover': { bgcolor: '#2c3e50' } }}
                            >
                            BMI 계산
                        </Button>
                        {bmi > 0 && (
                            // <Typography>
                            //     BMI: {bmi} ({getBMICategory(bmi)})
                            // </Typography>
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: getBMICategoryColor(bmi) }}>
                                BMI: {bmi}
                            </Typography>
                            <Typography variant="h6" sx={{ color: getBMICategoryColor(bmi) }}>
                                ({getBMICategory(bmi)})
                            </Typography>
                        </Box>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        체중 변화
                    </Typography>
                        <Box sx={{ height: 300, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightRecords}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1"/>
                                    <XAxis
                                    dataKey="date"
                                    stroke="#34495e"
                                    tick={{ fill: '#34495e' }}
                                />
                                <YAxis
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                    stroke="#34495e"
                                    tick={{ fill: '#34495e' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#34495e', color: '#ecf0f1' }}
                                    itemStyle={{ color: '#ecf0f1' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#3498db"
                                    strokeWidth={2}
                                    dot={{ fill: '#2980b9', stroke: '#3498db', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 8 }}
                                />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default HealthMetrics;