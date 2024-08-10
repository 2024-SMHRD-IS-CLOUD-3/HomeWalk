import React, { useEffect, useState } from 'react';
import { Typography, Paper, Grid, Avatar, Box, CircularProgress } from '@mui/material';
import { getFamilyData } from '../../api/family'; // 가족 정보와 구성원 정보를 가져오는 API 호출
import CrownIcon from '@mui/icons-material/EmojiEvents'; // 왕관 아이콘 가져오기 (MUI에서 제공하는 적절한 아이콘)

const MyFamily = () => {
    const [familyData, setFamilyData] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가
    const [userId, setUserId] = useState(null); // userId를 상태로 관리

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo'));
        if (userInfo?.userId) {
            setUserId(userInfo.userId); // userId를 상태에 저장
        }
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    useEffect(() => {
        const fetchFamilyData = async () => {
            if (userId) { // userId가 있을 때만 호출
                setLoading(true); // 데이터 요청 시작
                setError(null); // 에러 초기화
                try {
                    const data = await getFamilyData(userId); // userId를 이용하여 가족 정보 가져오기
                    setFamilyData(data);
                } catch (error) {
                    setError('가족 정보를 불러오는 데 실패했습니다.'); // 에러 메시지 설정
                    console.error('Error fetching family data:', error);
                } finally {
                    setLoading(false); // 데이터 요청 완료
                }
            }
        };

        fetchFamilyData();
    }, [userId]); // userId만 의존성 배열에 추가

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    나의 가족
                </Typography>
                {loading ? ( // 로딩 상태 처리
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : error ? ( // 에러 처리
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                ) : (
                    <>
                        <Typography variant="h5" component="h2" gutterBottom>
                            가족명: {familyData.familyName}
                        </Typography>
                        <Grid container spacing={2}>
                            {familyData.memberDetails.map((member, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <Avatar src={member.avatarCustomization} sx={{ width: 56, height: 56, mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6">{member.username}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {member.email}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Joined: {member.joinDate}
                                            </Typography>
                                        </Box>
                                        {/* 가족장인 경우 왕관 아이콘을 표시 */}
                                        {member.username === familyData.creatorName && (
                                            <CrownIcon
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    color: 'gold',
                                                }}
                                            />
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
            </Paper>
        </Grid>
    );
};

export default MyFamily;
