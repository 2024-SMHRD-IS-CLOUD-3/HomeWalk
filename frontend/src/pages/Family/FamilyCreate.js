import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, Alert, Grid } from '@mui/material';
import { createFamily } from '../../api/family';
import { useAuth } from '../../context/AuthContext';

const FamilyCreate = () => {
    const { userObject } = useAuth(); // userObject에서 userId를 가져옴
    const [newFamilyName, setNewFamilyName] = useState('');
    const [error, setError] = useState('');

    const handleCreateFamily = async () => {
        if (!newFamilyName.trim()) {
            setError('가족 이름을 입력하세요.');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }

        try {
            await createFamily(userObject.userId, { familyName: newFamilyName }); // token과 가족 이름 전달
            setNewFamilyName('');
            setError('');
            // 가족 생성 후 추가 로직이 필요할 경우 여기에 작성
        } catch (error) {
            console.error('Error creating family:', error);
            setError('가족 생성 중 오류가 발생했습니다.');
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    가족 생성
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    label="가족 이름"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleCreateFamily}>
                    생성
                </Button>
            </Paper>
        </Grid>
    );
};

export default FamilyCreate;
