import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Paper, TextField, List, ListItem, ListItemText, Divider, Grid, Box, Button } from '@mui/material';
import { getFamilies, leaveFamily, requestJoinFamily, cancelJoinRequest } from '../../api/family';
import { useAuth } from '../../context/AuthContext';

const FamilyList = () => {
    const { userObject } = useAuth(); // userObject에서 userId를 가져옴
    const [families, setFamilies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFamilies = useCallback(async () => {
        try {
            if (!userObject?.userId) {
                return;
            }

            const fetchedFamilies = await getFamilies(userObject.userId);

            // 본인이 만든 가족을 제외하는 필터링 추가
            const filteredFamilies = fetchedFamilies.filter(family => {
                const creatorIdString = String(family.creatorId);
                const userIdString = String(userObject.userId);
                const isSame = creatorIdString === userIdString;
                return !isSame;
            });

            console.log('Filtered Families:', filteredFamilies);
            setFamilies(filteredFamilies);
        } catch (error) {
            console.error('Error fetching families:', error);
        }
    }, [userObject?.userId]);

    useEffect(() => {
        fetchFamilies();
    }, [fetchFamilies]);

    const handleJoinRequest = async (familyId) => {
        try {
            await requestJoinFamily(userObject.userId, familyId);
            alert('가입 신청이 완료되었습니다.');
            fetchFamilies(); // 가입 신청 후 상태 갱신
        } catch (error) {
            console.error('Error requesting to join family:', error);
            alert('가입 신청 중 오류가 발생했습니다.');
        }
    };

    const handleCancelJoinRequest = async (familyId) => {
        try {
            await cancelJoinRequest(userObject.userId, familyId);
            alert('가입 신청이 취소되었습니다.');
            fetchFamilies(); // 가입 취소 후 상태 갱신
        } catch (error) {
            console.error('Error canceling join request:', error);
            alert('가입 신청 취소 중 오류가 발생했습니다.');
        }
    };

    const handleLeaveFamily = async (familyId) => {
        try {
            await leaveFamily(userObject.userId, familyId);
            alert('가족에서 탈퇴했습니다.');
            fetchFamilies(); // 탈퇴 후 상태 갱신
        } catch (error) {
            console.error('Error leaving family:', error);
            alert('가족 탈퇴 중 오류가 발생했습니다.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredFamiliesToDisplay = families.filter(family =>
        family.familyName && family.familyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    가족 목록
                </Typography>
                <TextField
                    label="검색"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <List>
                    {filteredFamiliesToDisplay.map((family) => (
                        <React.Fragment key={family.familyId}>
                            <ListItem>
                                <ListItemText
                                    primary={family.familyName}
                                    secondary={
                                        <>
                                            <Box component="span" fontWeight="fontWeightBold">
                                                만든이: {family.creatorName}
                                            </Box>
                                            {/* 구성원 목록을 표시 */}
                                            <Box component="span" display="block" mt={1}>
                                                구성원: {family.members.join(', ')}
                                            </Box>
                                        </>
                                    }
                                />
                                {/* 가입 상태에 따른 버튼 표시 */}
                                {family.isMember ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleLeaveFamily(family.familyId)}
                                        sx={{ ml: 2 }}
                                    >
                                        탈퇴
                                    </Button>
                                ) : family.joinRequested ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCancelJoinRequest(family.familyId)}
                                        sx={{ ml: 2 }}
                                    >
                                        가입 취소
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() => handleJoinRequest(family.familyId)}
                                        sx={{ ml: 2 }}
                                    >
                                        가입
                                    </Button>
                                )}
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Grid>
    );
};

export default FamilyList;
