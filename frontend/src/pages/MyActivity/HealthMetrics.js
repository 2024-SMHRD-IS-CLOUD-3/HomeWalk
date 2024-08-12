import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LabelList } from 'recharts';

const HealthMetrics = ({ weightData, familyData, COLORS }) => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [bmi, setBmi] = useState(0);

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
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                건강 지표
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>BMI 계산기</Typography>
                        <TextField label="키 (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} sx={{ mb: 1, width: '100%' }} />
                        <TextField label="체중 (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} sx={{ mb: 1, width: '100%' }} />
                        <Button variant="contained" onClick={calculateBMI} sx={{ mb: 1, width: '100%' }}>BMI 계산</Button>
                        {bmi > 0 && <Typography>BMI: {bmi} ({getBMICategory(bmi)})</Typography>}
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
        </>
    );
};

export default HealthMetrics;
